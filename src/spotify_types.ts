export type Paging<T> = {
  href: string,
  items: T[],
  limit: number,
  next: string | null,
  offset: number,
  previous: string | null,
  total: number
};

export type ExternalUrl = {
  [key: string]: string
};

export type ExternalId = {
  [key: string]: string
};

export type Followers = {
  href: string | null,
  total: number
};

export type Image = {
  height: number | undefined | null,
  width: number | undefined | null,
  url: string
};

export type PublicUser = {
  display_name: string | null,
  external_urls: ExternalUrl,
  followers: Followers,
  href: string,
  id: string,
  images: Image[],
  type: "user",
  uri: string
}

export type PrivateUser = PublicUser & {
  country: string,
  email: string,
  product: string,
};

export type Playlist = {
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

export type SimplifiedArtist = {
  external_urls: ExternalUrl,
  href: string,
  id: string,
  name: string,
  type: "artist",
  uri: string
};

export type SimplifiedAlbum = {
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

export type SimplifiedTrack = {
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

export type FullTrack = SimplifiedTrack & {
  album: SimplifiedAlbum,
  external_ids: ExternalId,
  popularity: number
}

export type PlaylistTrack = {
  added_at: string | null,
  added_by: PublicUser,
  is_local: boolean,
  track: FullTrack
};

export type AudioFeatures = {
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
