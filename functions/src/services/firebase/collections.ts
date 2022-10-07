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
