export type SpotifyUser = {
  id: string;
  images: {
    url: string;
    width: number;
    height: number;
  }[];
};

export type SpotifyApiPlaylist = {
  id: string;
  name: string;
};

export type SpotifyApiPlaylistDetails = {
  id: string;
  name: string;
  description?: string | null | undefined;
  images: {
    url: string;
  }[];
};

export type SpotifyApiTrack = {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null | undefined;
  album: {
    id: string;
    name: string;
    images: {
      url: string;
      width: number;
      height: number;
    }[];
  };
};

export const ALL_SPOTIFY_API_AUDIO_FEATURES = [
  "accousticness",
  "danceability",
  "duration_ms",
  "energy",
  "instrumentalness",
  "liveness",
  "loudness",
  "speechiness",
  "tempo",
  "valence",
] as const;
export type SpotifyApiAudioFeature =
  typeof ALL_SPOTIFY_API_AUDIO_FEATURES[number];

export type SpotifyApiAudioFeatures = {
  id: string;
} & {
  [F in SpotifyApiAudioFeature]?: number | null | undefined;
};
