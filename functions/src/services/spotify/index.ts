import {
  ALL_AUDIO_FEATURES,
  AudioFeatureRanges,
  Playlist,
  Track,
} from "../../models";
import {
  Observable,
  bufferCount,
  combineLatest,
  concatMap,
  filter,
  from,
  identity,
  map,
  share,
} from "rxjs";
import { ResponseOf, runRequest } from "../../lib/request";
import {
  audioFeaturesRequest,
  meRequest,
  playlistCreateRequest,
  playlistRequest,
  playlistsRequest,
  tokenRefreshRequest,
  tokenRequest,
  trackAddRequest,
  tracksRequest,
} from "./api";
import { pairByKey, toPromise } from "../../lib/observable";

import { FirebaseService } from "../firebase";
import invariant from "tiny-invariant";

function assembleTracks(
  tracks$: Observable<ResponseOf<typeof tracksRequest>[number]>,
  audioFeatures$: Observable<ResponseOf<typeof audioFeaturesRequest>[number]>
): Observable<Track> {
  return pairByKey(tracks$, audioFeatures$, "id").pipe(
    map(([track, audioFeature]) => ({
      id: track.id,
      uri: track.uri,
      name: track.name,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      album: track.album,
      accousticness: audioFeature.accousticness,
      danceability: audioFeature.danceability,
      energy: audioFeature.energy,
      instrumentalness: audioFeature.instrumentalness,
      liveness: audioFeature.liveness,
      loudness: audioFeature.loudness,
      speechiness: audioFeature.speechiness,
      tempo: audioFeature.tempo,
      valence: audioFeature.valence,
    }))
  );
}

function trackPredicate(
  track: Track,
  audioFeatureRanges: AudioFeatureRanges
): boolean {
  for (const feature of ALL_AUDIO_FEATURES) {
    const targetRange = audioFeatureRanges[feature];
    const featureValue = track[feature];
    if (targetRange == null) {
      continue;
    }
    if (featureValue == null) {
      return false;
    }
    if (featureValue < targetRange.min || featureValue > targetRange.max) {
      return false;
    }
  }
  return true;
}

export const SpotifyService = (firebaseService: FirebaseService) => {
  async function getValidToken(uid: string): Promise<string> {
    const now = Math.floor(new Date().getTime() / 1000);
    const authDoc = await firebaseService.getAuthDoc(uid);
    invariant(authDoc); // TODO: Handle this case.

    if (authDoc.expiresAt <= now) {
      const refreshed = await runRequest(tokenRefreshRequest, {
        refreshToken: authDoc.refreshToken,
      });
      await firebaseService.updateAuthDoc(uid, {
        accessToken: refreshed.accessToken,
        expiresAt: now + refreshed.expiresIn,
      });
      return refreshed.accessToken;
    }
    return authDoc.accessToken;
  }

  async function connectSpotify(uid: string, code: string): Promise<void> {
    const { accessToken, refreshToken, expiresIn } = await runRequest(
      tokenRequest,
      { code }
    );
    const now = Math.floor(new Date().getTime() / 1000);

    await firebaseService.createAuthDoc(uid, {
      accessToken,
      refreshToken,
      expiresAt: now + expiresIn,
    });
  }

  function getPlaylists(accessToken$: Promise<string>): Observable<Playlist> {
    return from(accessToken$).pipe(
      concatMap((accessToken) =>
        runRequest(playlistsRequest, {
          accessToken,
          limit: 50, // TODO: do actual batching.
        })
      ),
      concatMap(identity)
    );
  }

  async function getPlaylist(
    accessToken$: Promise<string>,
    playlistId: string
  ): Promise<Playlist> {
    return runRequest(playlistRequest, {
      accessToken: await accessToken$,
      playlistId,
    });
  }

  function getTracks(
    accessToken$: Promise<string>,
    playlistId: string
  ): Observable<Track> {
    const rawTracks$ = from(accessToken$).pipe(
      concatMap((accessToken) =>
        runRequest(tracksRequest, {
          accessToken,
          playlistId,
          limit: 50, // TODO: do actual batching.
        })
      ),
      concatMap(identity),
      share()
    );
    const trackIdBatch$ = rawTracks$.pipe(
      map((track) => track.id),
      bufferCount(50)
    );
    const audioFeatures$ = combineLatest([accessToken$, trackIdBatch$]).pipe(
      concatMap(([accessToken, trackIds]) =>
        runRequest(audioFeaturesRequest, {
          accessToken,
          trackIds,
        })
      ),
      concatMap(identity)
    );
    return assembleTracks(rawTracks$, audioFeatures$);
  }

  async function createPlaylist(
    accessToken$: Promise<string>,
    playlistName: string
  ): Promise<string> {
    const me$ = runRequest(meRequest, { accessToken: await accessToken$ });
    return runRequest(playlistCreateRequest, {
      accessToken: await accessToken$,
      playlistName,
      userId: (await me$).id,
    });
  }

  async function exportPlaylist(
    accessToken$: Promise<string>,
    originalPlaylistId: string,
    playlistName: string,
    audioFeatureRanges: AudioFeatureRanges
  ): Promise<string> {
    const trackUris$ = toPromise(
      getTracks(accessToken$, originalPlaylistId).pipe(
        filter((track) => trackPredicate(track, audioFeatureRanges)),
        map((track) => track.id)
      )
    );

    const playlistId$ = createPlaylist(accessToken$, playlistName);

    await runRequest(trackAddRequest, {
      accessToken: await accessToken$,
      playlistId: await playlistId$,
      trackUris: await trackUris$,
    });

    return playlistId$;
  }

  return {
    getValidToken,
    connectSpotify,
    getPlaylists,
    getPlaylist,
    getTracks,
    exportPlaylist,
  };
};

export type SpotifyService = ReturnType<typeof SpotifyService>;
