import {
  AudioFeatureRanges,
  Playlist,
  Track,
  filterByAudioFeatureRanges,
  PlaylistDetails,
} from "../../models";
import {
  Observable,
  bufferCount,
  combineLatestWith,
  concatMap,
  from,
  identity,
  map,
  pipe,
  share,
  tap,
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
import { pairByKey, partitionMerge, toPromise } from "../../lib/observable";

import { DatabaseService } from "../database";
import invariant from "tiny-invariant";
import { EnvService } from "../env";

function assemblePlaylistDetails(
  playlistDetail: ResponseOf<typeof playlistRequest>
): PlaylistDetails {
  return {
    id: playlistDetail.id,
    name: playlistDetail.name,
    images: playlistDetail.images,
    description: playlistDetail.description,
    externalUrls: playlistDetail.external_urls,
  };
}

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
      externalUrls: track.external_urls,
      artists: track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls,
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        externalUrls: track.album.external_urls,
        images: track.album.images,
      },
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

/**
 * Error: Valid Spotify token cannot be obtained.
 */
export class SpotifyTokenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const SpotifyService = (
  env: EnvService,
  databaseService: DatabaseService
) => {
  async function getValidToken(uid: string): Promise<string> {
    const now = Math.floor(new Date().getTime() / 1000);
    const authDoc = await databaseService.getAuthDoc(uid);
    invariant(authDoc); // TODO: Handle this case.

    if (authDoc.expiresAt <= now) {
      try {
        const refreshed = await runRequest(tokenRefreshRequest, {
          refreshToken: authDoc.refreshToken,
          clientId: env.SPOTIFY_CLIENT_ID,
          clientSecret: env.SPOTIFY_CLIENT_SECRET,
        });
        await databaseService.updateAuthDoc(uid, {
          accessToken: refreshed.accessToken,
          expiresAt: now + refreshed.expiresIn,
        });
        return refreshed.accessToken;
      } catch (err) {
        console.error(err);
        throw new SpotifyTokenError("Failed to refresh Spotify token.");
      }
    }
    return authDoc.accessToken;
  }

  /**
   * Sign in with Spotify and return the Spotify user ID.
   */
  async function signIn(code: string): Promise<string> {
    const { accessToken, refreshToken, expiresIn } = await runRequest(
      tokenRequest,
      {
        code,
        appBaseUrl: env.APP_BASE_URL,
        clientId: env.SPOTIFY_CLIENT_ID,
        clientSecret: env.SPOTIFY_CLIENT_SECRET,
      }
    );
    const user = await runRequest(meRequest, { accessToken });
    const now = Math.floor(new Date().getTime() / 1000);

    await databaseService.createAuthDoc({
      _id: user.id,
      accessToken,
      refreshToken,
      expiresAt: now + expiresIn,
    });

    return user.id;
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
    const response = await runRequest(playlistRequest, {
      accessToken: await accessToken$,
      playlistId,
    });
    return assemblePlaylistDetails(response);
  }

  function getAudioFeatures(
    accessToken$: Promise<string>,
    trackId$: Observable<string>
  ): Observable<ResponseOf<typeof audioFeaturesRequest>[number]> {
    return trackId$.pipe(
      concatMap(
        (trackId) =>
          databaseService
            .getAudioFeaturesCache(trackId)
            .then((cache) => (cache ? { id: trackId, ...cache } : trackId)) // Push trackId if cache miss. Push cache if hit.
      ),
      partitionMerge(
        (value): value is string => typeof value === "string",
        // if cache miss:
        pipe(
          bufferCount(50),
          combineLatestWith(accessToken$),
          concatMap(([trackIds, accessToken]) =>
            runRequest(audioFeaturesRequest, { accessToken, trackIds })
          ),
          concatMap(identity),
          tap((audioFeatures) =>
            databaseService.setAudioFeaturesCache(
              audioFeatures.id,
              audioFeatures
            )
          )
        ),
        // if cache hit:
        identity
      )
    );
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
    const trackIds$ = rawTracks$.pipe(map((track) => track.id));
    const audioFeatures$ = getAudioFeatures(accessToken$, trackIds$);
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
        filterByAudioFeatureRanges(audioFeatureRanges),
        map((track) => track.uri)
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
    signIn,
    getPlaylists,
    getPlaylist,
    getTracks,
    exportPlaylist,
  };
};

export type SpotifyService = ReturnType<typeof SpotifyService>;
