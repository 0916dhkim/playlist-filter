import {
  ALL_AUDIO_FEATURES,
  AudioFeatureRanges,
  Playlist,
  Track,
} from "../../models";
import {
  Observable,
  bufferCount,
  concatMap,
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

// TODO: find a better name.
function getTracks(accessToken: string, playlistId: string): Observable<Track> {
  const rawTracks$ = from(
    runRequest(tracksRequest, {
      accessToken,
      playlistId,
      limit: 50, // TODO: do actual batching.
    })
  ).pipe(concatMap(identity), share());
  const audioFeatures$ = rawTracks$.pipe(
    map((rawTrack) => rawTrack.id),
    bufferCount(50),
    concatMap((trackIds) =>
      runRequest(audioFeaturesRequest, {
        accessToken,
        trackIds,
      })
    ),
    concatMap(identity)
  );
  return assembleTracks(rawTracks$, audioFeatures$);
}

export const SpotifyService = (firebaseService: FirebaseService) => {
  const getRefreshedToken = (refreshToken: string) =>
    runRequest(tokenRefreshRequest, { refreshToken });

  const getValidToken = async (uid: string): Promise<string> => {
    const now = Math.floor(new Date().getTime() / 1000);
    const spotifyAuth = await firebaseService.getAuthDoc(uid);
    invariant(spotifyAuth); // TODO: Handle this case.
    const { accessToken, refreshToken, expiresAt } = spotifyAuth;
    if (expiresAt <= now) {
      const refreshed = await getRefreshedToken(refreshToken);
      await firebaseService.updateAuthDoc(uid, {
        accessToken: refreshed.accessToken,
        expiresAt: now + refreshed.expiresIn,
      });
      return refreshed.accessToken;
    }
    return accessToken;
  };

  const getTokenWithAuthorizationCode = async (code: string) =>
    runRequest(tokenRequest, { code });

  return {
    async connectSpotify(uid: string, code: string): Promise<void> {
      const { accessToken, refreshToken, expiresIn } =
        await getTokenWithAuthorizationCode(code);
      const now = Math.floor(new Date().getTime() / 1000);

      await firebaseService.createAuthDoc(uid, {
        accessToken,
        refreshToken,
        expiresAt: now + expiresIn,
      });
    },

    getRefreshedToken,

    getPlaylists(uid: string): Observable<Playlist> {
      return from(getValidToken(uid)).pipe(
        concatMap((accessToken) =>
          runRequest(playlistsRequest, {
            accessToken,
            limit: 50, // TODO: do actual batching.
          })
        ),
        concatMap(identity)
      );
    },

    async getPlaylist(uid: string, playlistId: string): Promise<Playlist> {
      const accessToken = await getValidToken(uid);
      const playlist = await runRequest(playlistRequest, {
        accessToken,
        playlistId,
      });
      return playlist;
    },

    getTracks(uid: string, playlistId: string): Observable<Track> {
      return from(getValidToken(uid)).pipe(
        concatMap((accessToken) => getTracks(accessToken, playlistId))
      );
    },

    async exportPlaylist(
      uid: string,
      originalPlaylistId: string,
      playlistName: string,
      audioFeatureRanges: AudioFeatureRanges
    ): Promise<string> {
      const accessToken = await getValidToken(uid);
      const me = await runRequest(meRequest, { accessToken });

      const trackUris = (
        await toPromise(getTracks(accessToken, originalPlaylistId))
      )
        .filter((track) => trackPredicate(track, audioFeatureRanges))
        .map((track) => track.uri);

      const playlistId = await runRequest(playlistCreateRequest, {
        accessToken,
        playlistName,
        userId: me.id,
      });

      await runRequest(trackAddRequest, {
        accessToken,
        playlistId,
        trackUris,
      });

      return playlistId;
    },
  };
};

export type SpotifyService = ReturnType<typeof SpotifyService>;
