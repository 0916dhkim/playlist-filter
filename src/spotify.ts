import axios from "axios";
import { API_ROOT } from "./config";
import { Track } from "./store";

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
 * @param maxRetry Max number of trial before throwing error.
 */
async function rateLimitedRequest<T>(url: string, accessToken: string, maxRetry: number = 3): Promise<T> {
  for (let i = 0; i < maxRetry; i++) {
    const res = await axios.get(url, {
      headers: { "Authorization": `Bearer ${accessToken}` }
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

type Paging<T> = {
  href: string,
  items: T[],
  limit: number,
  next: string | null,
  offset: number,
  previous: string | null,
  total: number
};

async function requestAllPages<T>(url: string, accessToken: string): Promise<T[]> {
  let nextUrl: string | null = url;
  const items: T[] = [];
  while (nextUrl) {
    const res: Paging<T> = await rateLimitedRequest<Paging<T>>(nextUrl, accessToken);
    for (let item of res.items) {
      items.push(item);
    }
    nextUrl = res.next;
  }
  return items;
}

type ExternalUrl = {
  [key: string]: string
};

type ExternalId = {
  [key: string]: string
};

type Followers = {
  href: string | null,
  total: number
};

type Image = {
  height: number | undefined | null,
  width: number | undefined | null,
  url: string
};

type PublicUser = {
  display_name: string | null,
  external_urls: ExternalUrl,
  followers: Followers,
  href: string,
  id: string,
  images: Image[],
  type: "user",
  uri: string
}

type PrivateUser = PublicUser & {
  country: string,
  email: string,
  product: string,
};

type Playlist = {
  collaborative: boolean,
  description: string | null,
  external_urls: ExternalUrl,
  href: string,
  id: string,
  images: Image[],
  name: string,
  owner: PublicUser,
  public: boolean | null,
  snapshot_id: string,
  tracks: {
    href: string,
    total: number
  } | null,
  type: "playlist",
  uri: string
};

type SimplifiedArtist = {
  external_urls: ExternalUrl,
  href: string,
  id: string,
  name: string,
  type: "artist",
  uri: string
};

type SimplifiedAlbum = {
  album_group: string | undefined,
  album_type: "album" | "single" | "compilation",
  artists: SimplifiedArtist[],
  available_markets: string[],
  external_urls: ExternalUrl,
  href: string,
  id: string,
  images: Image[],
  name: string,
  release_date: string,
  release_date_precision: "year" | "month" | "day",
  restrictions: { reason: string },
  type: "album",
  uri: string
};

type SimplifiedTrack = {
  artists: SimplifiedArtist[],
  available_markets: string[],
  disc_number: number,
  duration_ms: number,
  explicit: boolean,
  external_urls: ExternalUrl,
  href: string,
  id: string,
  is_playable: boolean,
  restrictions: { reason: string },
  name: string,
  preview_url: string | null,
  track_number: number,
  type: "track",
  uri: string,
  is_local: boolean
};

type FullTrack = SimplifiedTrack & {
  album: SimplifiedAlbum,
  external_ids: ExternalId,
  popularity: number
}

type PlaylistTrack = {
  added_at: string | null,
  added_by: PublicUser,
  is_local: boolean,
  track: FullTrack
};

type AudioFeatures = {
  duration_ms: number,
  key: number,
  mode: number,
  time_signature: number,
  acousticness: number,
  danceability: number,
  energy: number,
  instrumentalness: number,
  liveness: number,
  loudness: number,
  speechiness: number,
  valence: number,
  tempo: number,
  id: string,
  uri: string,
  track_href: string,
  analysis_url: string,
  type: "audio_features"
};

export async function getMe(accessToken: string): Promise<PrivateUser> {
  const url = `${API_ROOT}/me`;
  return rateLimitedRequest(url, accessToken);
}

export async function getUserPlaylists(accessToken: string): Promise<Playlist[]> {
  const me = await getMe(accessToken);
  const url = `${API_ROOT}/users/${me.id}/playlists`;
  return requestAllPages(url, accessToken);
}

export async function getPlaylistTracks(playlistId: string, accessToken: string): Promise<Array<Track>> {
  const url = `${API_ROOT}/playlists/${playlistId}/tracks`;
  const tracks = await requestAllPages<PlaylistTrack>(url, accessToken);
  const batches = splitIntoBatches(tracks, 40);
  const ret: Array<Track> = [];

  for (let batch of batches) {
    const ids = batch.map(t => t.track.id);
    const url = `${API_ROOT}/audio-features/?ids=${ids.join(",")}`;
    const { audio_features } = await rateLimitedRequest<{"audio_features": AudioFeatures[]}>(url, accessToken);
    for (let i = 0; i < batch.length; i++) {
      ret.push({...batch[i].track, ...audio_features[i]});
    }
  }

  return ret;
}
