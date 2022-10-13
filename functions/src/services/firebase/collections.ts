import { z } from "zod";

export type CollectionSpec<TDoc> = {
  name: string;
  schema: z.ZodType<TDoc>;
};

const buildCollectionSpec = <T extends CollectionSpec<any>>(spec: T): T => spec;

export type DocOf<TCollection> = TCollection extends CollectionSpec<infer R>
  ? R
  : never;

export const spotifyAuthCollection = buildCollectionSpec({
  name: "SpotifyAuth",
  schema: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.number(),
  }),
});

export const audioFeaturesCacheCollection = buildCollectionSpec({
  name: "AudioFeaturesCache",
  schema: z.object({
    expiresAt: z.number(),
    audioFeatures: z.object({
      accousticness: z.optional(z.number()),
      danceability: z.optional(z.number()),
      duration_ms: z.optional(z.number()),
      energy: z.optional(z.number()),
      instrumentalness: z.optional(z.number()),
      liveness: z.optional(z.number()),
      loudness: z.optional(z.number()),
      mode: z.optional(z.number()),
      speechiness: z.optional(z.number()),
      tempo: z.optional(z.number()),
      time_signature: z.optional(z.number()),
      valence: z.optional(z.number()),
    }),
  }),
});
