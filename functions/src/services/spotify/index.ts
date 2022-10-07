import {
  ALL_AUDIO_FEATURES,
  Playlist,
  PlaylistFilter,
  Track,
} from "../../models";
import {
  Observable,
  bufferCount,
  concatMap,
  filter,
  from,
  identity,
  lastValueFrom,
  map,
  toArray,
} from "rxjs";
import { ResponseOf, runRequest } from "../../request";
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

import { pairByKey } from "../../utils";

export async function getTokenWithAuthorizationCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  return runRequest(tokenRequest, { code });
}

export const getRefreshedToken = (refreshToken: string) =>
  runRequest(tokenRefreshRequest, { refreshToken });

export async function* getPlaylists(
  accessToken: string
): AsyncGenerator<Playlist, void, unknown> {
  const playlists = await runRequest(playlistsRequest, {
    accessToken,
    limit: 50, // TODO: do actual batching.
  });
  for (const playlist of playlists) {
    yield playlist;
  }
}

export async function getPlaylist(
  accessToken: string,
  playlistId: string
): Promise<Playlist> {
  const playlist = await runRequest(playlistRequest, {
    accessToken,
    playlistId,
  });
  return playlist;
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

export function getTracks(
  accessToken: string,
  playlistId: string
): Observable<Track> {
  const rawTracks$ = from(
    runRequest(tracksRequest, {
      accessToken,
      playlistId,
      limit: 50, // TODO: do actual batching.
    })
  ).pipe(concatMap(identity));
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

function trackPredicate(track: Track, playlistFilter: PlaylistFilter): boolean {
  for (const feature of ALL_AUDIO_FEATURES) {
    const targetRange = playlistFilter[feature];
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

export async function exportPlaylist(
  accessToken: string,
  originalPlaylistId: string,
  playlistName: string,
  playlistFilter: PlaylistFilter
): Promise<string> {
  const me = await runRequest(meRequest, { accessToken });

  const trackUris = await lastValueFrom(
    getTracks(accessToken, originalPlaylistId).pipe(
      filter((track) => trackPredicate(track, playlistFilter)),
      map((track) => track.uri),
      toArray()
    )
  );

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
}
