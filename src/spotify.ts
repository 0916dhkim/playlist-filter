import axios, { CancelToken } from "axios";
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
 * Send HTTP request to Spotify and handle rate-limited message.
 * @param url Target URL to send request to.
 * @param accessToken Spotify access token.
 * @param cancelToken Axios cancel token.
 * @param maxRetry Max number of trial before throwing error.
 */
async function rateLimitedRequest<T>(url: string, accessToken: string, cancelToken: CancelToken, maxRetry: number = 3): Promise<T> {
  for (let i = 0; i < maxRetry; i++) {
    const res = await axios.get(url, {
      headers: { "Authorization": `Bearer ${accessToken}` },
      cancelToken
    });
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

async function requestAllPages<T>(url: string, accessToken: string, cancelToken: CancelToken): Promise<T[]> {
  let nextUrl: string | null = url;
  const items: T[] = [];
  while (nextUrl) {
    const res: Paging<T> = await rateLimitedRequest<Paging<T>>(nextUrl, accessToken, cancelToken);
    for (let item of res.items) {
      items.push(item);
    }
    nextUrl = res.next;
  }
  return items;
}

export async function getMe(accessToken: string, cancelToken: CancelToken): Promise<PrivateUser> {
  const url = `${API_ROOT}/me`;
  return rateLimitedRequest(url, accessToken, cancelToken);
}

export async function getUserPlaylists(accessToken: string, cancelToken: CancelToken): Promise<Playlist[]> {
  const me = await getMe(accessToken, cancelToken);
  const url = `${API_ROOT}/users/${me.id}/playlists`;
  return requestAllPages(url, accessToken, cancelToken);
}

export async function getPlaylistTracks(playlistId: string, accessToken: string, cancelToken: CancelToken): Promise<Array<TrackInfo>> {
  const url = `${API_ROOT}/playlists/${playlistId}/tracks`;
  const tracks = await requestAllPages<PlaylistTrack>(url, accessToken, cancelToken);
  const batches = splitIntoBatches(tracks, 40);
  const ret: Array<TrackInfo> = [];

  for (let batch of batches) {
    const ids = batch.map(t => t.track.id);
    const url = `${API_ROOT}/audio-features/?ids=${ids.join(",")}`;
    const { audio_features } = await rateLimitedRequest<{"audio_features": AudioFeatures[]}>(url, accessToken, cancelToken);
    for (let i = 0; i < batch.length; i++) {
      ret.push({...batch[i].track, ...audio_features[i]});
    }
  }

  return ret;
}
