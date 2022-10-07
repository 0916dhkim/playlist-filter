import z, { ZodLiteral } from "zod";

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
  uri: string;
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

function literalArray<TLiterals extends (string | number)[]>(
  ...literals: TLiterals
) {
  return literals.map((each) => z.literal(each)) as {
    [K in keyof TLiterals]: ZodLiteral<TLiterals[K]>;
  };
}

export const playlistFilterSchema = z.record(
  z.union(literalArray(...ALL_AUDIO_FEATURES)),
  z.object({
    min: z.number(),
    max: z.number(),
  })
);
// TODO: Reduce repetition by using infer.
export type PlaylistFilter = z.infer<typeof playlistFilterSchema>;

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
