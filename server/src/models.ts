import { Observable, filter } from "rxjs";

import { stringLiteralUnion } from "./lib/schema";
import { z } from "zod";

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
  externalUrls: {
    spotify: string;
  };
};

export type Track = {
  id: string;
  uri: string;
  name: string;
  durationMs: number;
  previewUrl?: string | null | undefined;
  externalUrls: {
    spotify: string;
  };
  artists: {
    id: string;
    name: string;
    externalUrls: {
      spotify: string;
    };
  }[];
  album: {
    id: string;
    name: string;
    externalUrls: {
      spotify: string;
    };
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

export const audioFeatureSchema = stringLiteralUnion(...ALL_AUDIO_FEATURES);
export type AudioFeature = z.infer<typeof audioFeatureSchema>;

export const audioFeatureRangesSchema = z.record(
  audioFeatureSchema,
  z.object({
    min: z.number(),
    max: z.number(),
  })
);
export type AudioFeatureRanges = z.infer<typeof audioFeatureRangesSchema>;

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

export const filterByAudioFeatureRanges =
  (audioFeatureRanges: AudioFeatureRanges) =>
  (track$: Observable<Track>): Observable<Track> => {
    return track$.pipe(
      filter((track) => {
        for (const feature of ALL_AUDIO_FEATURES) {
          const targetRange = audioFeatureRanges[feature];
          const featureValue = track[feature];
          if (targetRange == null) {
            continue;
          }
          if (featureValue == null) {
            return false;
          }
          if (
            featureValue < targetRange.min ||
            featureValue > targetRange.max
          ) {
            return false;
          }
        }
        return true;
      })
    );
  };
