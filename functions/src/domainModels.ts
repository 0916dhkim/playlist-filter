import { SpotifyApiAudioFeatures, SpotifyApiTrack } from "./spotify/models";

import { zipObjectArray } from "./utils";

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

export function assembleTracks(
  tracks: SpotifyApiTrack[],
  audioFeatures: SpotifyApiAudioFeatures[]
): Track[] {
  return zipObjectArray(tracks, audioFeatures, "id").map((combined) => ({
    id: combined.id,
    name: combined.name,
    durationMs: combined.duration_ms,
    previewUrl: combined.preview_url,
    album: combined.album,
    accousticness: combined.accousticness,
    danceability: combined.danceability,
    energy: combined.energy,
    instrumentalness: combined.instrumentalness,
    liveness: combined.liveness,
    loudness: combined.loudness,
    speechiness: combined.speechiness,
    tempo: combined.tempo,
    valence: combined.valence,
  }));
}

export function calculateAudioFeatureRanges(
  tracks: Track[]
): AudioFeatureRanges {
  const ret: AudioFeatureRanges = {};
  for (const track of tracks) {
    for (const feature of ALL_AUDIO_FEATURES) {
      const featureValue = track[feature];
      const originalRange = ret[feature];
      if (featureValue != null) {
        if (originalRange === undefined) {
          ret[feature] = { min: featureValue, max: featureValue };
        } else {
          ret[feature] = {
            min: Math.min(originalRange.min, featureValue),
            max: Math.max(originalRange.max, featureValue),
          };
        }
      }
    }
  }
  return ret;
}
