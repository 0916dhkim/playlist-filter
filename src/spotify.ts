import axios, { CancelToken, AxiosRequestConfig } from "axios";
import { TrackInfo } from "./state";
import { API_ROOT } from "./config";
import {
  Paging,
  PrivateUser,
  Playlist,
  PlaylistTrack,
  AudioFeatures
} from "./spotify_types";

function splitIntoBatches<T>(arr: ReadonlyArray<T>, batchSize: number = 30): ReadonlyArray<ReadonlyArray<T>> {
  let i = 0;
  const ret: Array<Array<T>> = [];
  while (arr.length > i) {
    ret.push(arr.slice(i, i + batchSize));
    i += batchSize;
  }
  return ret;
}

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format access token to http bearer authorization header.
 * @param accessToken Spotify access token.
 */
function accessTokenToHeader(accessToken: string): { "Authorization": string } {
  return { "Authorization": `Bearer ${accessToken}` };
}

/**
 * Send HTTP request to Spotify and handle rate-limited message.
 * @param requestConfig Config for axios request.
 * @param maxRetry Max number of trial before throwing error.
 */
async function rateLimitedRequest<T>(requestConfig: AxiosRequestConfig, maxRetry: number = 3): Promise<T> {
  for (let i = 0; i < maxRetry; i++) {
    const res = await axios(requestConfig);
    if (res.status === 200) {
      return res.data;
    }
    if (res.status === 429) {
      const timer = parseFloat(res.headers["retry-after"]);
      if (isNaN(timer)) {
        throw new Error("Status code 429 but missing retry-after header.");
      }
      await timeout(timer * 1000);
    }
  }
  throw new Error(`Failed to get response after ${maxRetry} retries.`);
}

async function getAllPages<T>(url: string, accessToken: string, cancelToken: CancelToken): Promise<T[]> {
  let nextUrl: string | null = url;
  const items: T[] = [];
  while (nextUrl) {
    const res: Paging<T> = await rateLimitedRequest<Paging<T>>({
      method: "GET",
      url: nextUrl,
      headers: accessTokenToHeader(accessToken),
      cancelToken
    });
    for (let item of res.items) {
      items.push(item);
    }
    nextUrl = res.next;
  }
  return items;
}

async function getOne<T>(url: string, accessToken: string, cancelToken: CancelToken): Promise<T> {
  return rateLimitedRequest<T>({
    method: "GET",
    url,
    headers: accessTokenToHeader(accessToken),
    cancelToken
  });
}

export async function getMe(accessToken: string, cancelToken: CancelToken): Promise<PrivateUser> {
  const url = `${API_ROOT}/me`;
  return getOne(url, accessToken, cancelToken);
}

export async function getUserPlaylists(accessToken: string, cancelToken: CancelToken): Promise<Playlist[]> {
  const me = await getMe(accessToken, cancelToken);
  const url = `${API_ROOT}/users/${me.id}/playlists`;
  return getAllPages(url, accessToken, cancelToken);
}

export async function getPlaylistTracks(playlistId: string, accessToken: string, cancelToken: CancelToken): Promise<Array<TrackInfo>> {
  const url = `${API_ROOT}/playlists/${playlistId}/tracks`;
  const tracks = await getAllPages<PlaylistTrack>(url, accessToken, cancelToken);
  const batches = splitIntoBatches(tracks, 40);
  const ret: Array<TrackInfo> = [];

  for (let batch of batches) {
    const ids = batch.map(t => t.track.id);
    const url = `${API_ROOT}/audio-features/?ids=${ids.join(",")}`;
    const { audio_features } = await getOne<{"audio_features": AudioFeatures[]}>(url, accessToken, cancelToken);
    for (let i = 0; i < batch.length; i++) {
      ret.push({...batch[i].track, ...audio_features[i]});
    }
  }

  return ret;
}

/**
 * Create a new Spotify playlist and add tracks.
 * @param playlistName Name of new playlist.
 * @param trackUris Spotify URI of tracks to be added.
 * @param accessToken Spotify access token.
 * @param cancelToken Axios cancel token.
 */
export async function createPlaylist(playlistName: string, trackUris: ReadonlyArray<string>, accessToken: string, cancelToken: CancelToken): Promise<void> {
  if (trackUris.length > 100) {
    throw new Error("Cannot add more than 100 items at a time.");
  }

  const me = await getMe(accessToken, cancelToken);
  const creationUrl = `${API_ROOT}/users/${me.id}/playlists`;
  const creationRes = await rateLimitedRequest<Playlist>({
    url: creationUrl,
    headers: accessTokenToHeader(accessToken),
    data: JSON.stringify({ name: playlistName })
  });
  const additionUrl = `${API_ROOT}/playlists/${creationRes.id}/tracks`;
  await rateLimitedRequest({
    url: additionUrl,
    headers: accessTokenToHeader(accessToken),
    params: {
      uris: trackUris.join(",")
    }
  });
}
