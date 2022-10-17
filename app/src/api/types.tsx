export type Profile = {
  id: string;
  isConnectedToSpotify: boolean;
};

export type Playlist = {
  id: string;
  name: string;
};

export type PlaylistDetails = {
  id: string;
  name: string;
  description?: string | null | undefined;
  images: {
    url: string;
  }[];
};

export type Track = {
  id: string;
  name: string;
  durationMs: number;
  previewUrl?: string | null | undefined;
  album: {
    id: string;
    name: string;
    images: {
      url: string;
      width: number;
      height: number;
    }[];
  };
  accousticness?: number | null | undefined;
  danceability?: number | null | undefined;
  energy?: number | null | undefined;
  instrumentalness?: number | null | undefined;
  liveness?: number | null | undefined;
  loudness?: number | null | undefined;
  speechiness?: number | null | undefined;
  tempo?: number | null | undefined;
  valence?: number | null | undefined;
};

export const ALL_AUDIO_FEATURES = [
  "accousticness",
  "danceability",
  "durationMs",
  "energy",
  "instrumentalness",
  "liveness",
  "loudness",
  "speechiness",
  "tempo",
  "valence",
] as const;
export type AudioFeature = typeof ALL_AUDIO_FEATURES[number];
export type AudioFeatureRanges = {
  [F in AudioFeature]?: { min: number; max: number };
};
