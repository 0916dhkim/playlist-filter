import { AudioFeatureRanges, Playlist, PlaylistDetails, Track } from "./types";

import { QueryFunctionContext } from "@tanstack/react-query";
import { Tail } from "../typeHelpers";
import { getIdToken } from "../firebase";
import z from "zod";

type AnyQueryFunction = (
  ctx: QueryFunctionContext,
  ...args: any[]
) => Promise<any>;
type Query<TKey, TFunction extends AnyQueryFunction> = [
  [TKey, ...Tail<Parameters<TFunction>>],
  (ctx: QueryFunctionContext) => ReturnType<TFunction>
];

const Query =
  <TKey, TFunction extends AnyQueryFunction>(key: TKey, fn: TFunction) =>
  (...args: Tail<Parameters<TFunction>>): Query<TKey, TFunction> =>
    [
      [key, ...args],
      (ctx: QueryFunctionContext) => fn(ctx, ...args) as ReturnType<TFunction>,
    ];

export const queryKey = <TKey, TFunction extends AnyQueryFunction>(
  query: Query<TKey, TFunction>
) => query[0];

export const getPlaylists = Query(
  "playlists",
  async ({ signal }): Promise<Playlist[]> => {
    const idToken = await getIdToken();
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/playlists`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        signal,
      }
    );

    const parsed = z
      .object({
        playlists: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
      .parse(await response.json());

    return parsed.playlists;
  }
);

export const getPlaylistDetails = Query(
  "playlist",
  async ({ signal }, playlistId: string): Promise<PlaylistDetails> => {
    const idToken = await getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        signal,
      }
    );

    const parsed = z
      .object({
        playlist: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullish(),
          images: z.array(
            z.object({
              url: z.string(),
            })
          ),
        }),
      })
      .parse(await response.json());

    return parsed.playlist;
  }
);

export const getTracks = Query(
  "tracks",
  async (
    { signal },
    playlistId: string,
    audioFeatureRanges?: AudioFeatureRanges
  ): Promise<{
    tracks: Track[];
    audioFeatureRanges: AudioFeatureRanges;
  }> => {
    const idToken = await getIdToken();

    const params = new URLSearchParams();
    if (audioFeatureRanges) {
      params.append("audioFeatureRanges", JSON.stringify(audioFeatureRanges));
    }
    const url = new URL(
      `${
        import.meta.env.VITE_BACKEND_BASE_URL
      }/api/playlists/${playlistId}/tracks`
    );
    url.search = params.toString();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      signal,
    });

    const parsed = z
      .object({
        tracks: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            durationMs: z.number(),
            previewUrl: z.string().nullish(),
            album: z.object({
              id: z.string(),
              name: z.string(),
              images: z.array(
                z.object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                })
              ),
            }),
            accousticness: z.number().nullish(),
            danceability: z.number().nullish(),
            energy: z.number().nullish(),
            instrumentalness: z.number().nullish(),
            liveness: z.number().nullish(),
            loudness: z.number().nullish(),
            speechiness: z.number().nullish(),
            tempo: z.number().nullish(),
            valence: z.number().nullish(),
          })
        ),
        audioFeatureRanges: z.object({
          accousticness: z.optional(
            z.object({ min: z.number(), max: z.number() })
          ),
          danceability: z.optional(
            z.object({ min: z.number(), max: z.number() })
          ),
          durationMs: z.optional(
            z.object({ min: z.number(), max: z.number() })
          ),
          energy: z.optional(z.object({ min: z.number(), max: z.number() })),
          instrumentalness: z.optional(
            z.object({ min: z.number(), max: z.number() })
          ),
          liveness: z.optional(z.object({ min: z.number(), max: z.number() })),
          loudness: z.optional(z.object({ min: z.number(), max: z.number() })),
          speechiness: z.optional(
            z.object({ min: z.number(), max: z.number() })
          ),
          tempo: z.optional(z.object({ min: z.number(), max: z.number() })),
          valence: z.optional(z.object({ min: z.number(), max: z.number() })),
        }),
      })
      .parse(await response.json());
    return parsed;
  }
);
