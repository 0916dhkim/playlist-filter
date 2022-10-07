import { Request, buildRequest } from "../../request";

import env from "../../env";
import { z } from "zod";

export type SpotifyApiRequest<TVariables, TResponse> = {
  type: Request<TVariables, TResponse>["type"];
  path: (variables: TVariables) => string;
  body?: Request<TVariables, TResponse>["body"];
  urlParams?: Request<TVariables, TResponse>["urlParams"];
  responseParser: Request<TVariables, TResponse>["responseParser"];
};
const buildSpotifyApiRequest = <TVariables, TResponse>(
  request: SpotifyApiRequest<TVariables, TResponse>
): Request<TVariables & { accessToken: string }, TResponse> => ({
  type: request.type,
  url: (variables: TVariables) =>
    `https://api.spotify.com/v1${request.path(variables)}`,
  headers: (variables: { accessToken: string }) => ({
    Authorization: `Bearer ${variables.accessToken}`,
  }),
  body: request.body,
  urlParams: request.urlParams,
  responseParser: request.responseParser,
});

type TokenRequestInput = {
  code: string;
};
export const tokenRequest = buildRequest({
  type: "POST",
  url: () => "https://accounts.spotify.com/api/token",
  headers: () => ({
    Authorization: `Basic ${Buffer.from(
      `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64")}`,
  }),
  body: ({ code }: TokenRequestInput) => {
    const form = new URLSearchParams();
    form.append("grant_type", "authorization_code");
    form.append("code", code);
    form.append("redirect_uri", `${env.APP_BASE_URL}/callback`);
    return form;
  },
  responseParser: (response) => {
    const schema = z.object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number(),
    });
    const parsed = schema.parse(response);
    return {
      accessToken: parsed.access_token,
      refreshToken: parsed.refresh_token,
      expiresIn: parsed.expires_in,
    };
  },
});

type TokenRefreshRequestInput = {
  refreshToken: string;
};
export const tokenRefreshRequest = buildRequest({
  type: "POST",
  url: () => "https://accounts.spotify.com/api/token",
  headers: () => ({
    Authorization: `Basic ${Buffer.from(
      `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64")}`,
  }),
  body: ({ refreshToken }: TokenRefreshRequestInput) => {
    const form = new URLSearchParams();
    form.append("grant_type", "refresh_token");
    form.append("refresh_token", refreshToken);
    return form;
  },
  responseParser: (response) => {
    const schema = z.object({
      access_token: z.string(),
      expires_in: z.number(),
    });
    const parsed = schema.parse(response);
    return {
      accessToken: parsed.access_token,
      expiresIn: parsed.expires_in,
    };
  },
});

export const meRequest = buildSpotifyApiRequest({
  type: "GET",
  path: () => "/me",
  responseParser: z.object({
    id: z.string(),
    images: z.array(
      z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      })
    ),
  }).parse,
});

type PlaylistsRequestInput = {
  limit: number;
};
export const playlistsRequest = buildSpotifyApiRequest({
  type: "GET",
  path: () => "/me/playlists",
  urlParams: ({ limit }: PlaylistsRequestInput) => ({ limit }),
  responseParser: (response) => {
    const schema = z.object({
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    });
    return schema.parse(response).items;
  },
});

type PlaylistRequestInput = {
  playlistId: string;
};
export const playlistRequest = buildSpotifyApiRequest({
  type: "GET",
  path: ({ playlistId }: PlaylistRequestInput) => `/playlists/${playlistId}`,
  responseParser: z.object({
    id: z.string(),
    name: z.string(),
    description: z.nullable(z.string()),
    images: z.array(
      z.object({
        url: z.string(),
      })
    ),
  }).parse,
});

type TracksRequestInput = {
  playlistId: string;
  limit: number;
};
export const tracksRequest = buildSpotifyApiRequest({
  type: "GET",
  path: ({ playlistId }: TracksRequestInput) =>
    `/playlists/${playlistId}/tracks`,
  urlParams: ({ limit }: TracksRequestInput) => ({ limit }),
  responseParser: (response) => {
    const schema = z.object({
      items: z.array(
        z.object({
          track: z.object({
            id: z.string(),
            uri: z.string(),
            name: z.string(),
            duration_ms: z.number(),
            preview_url: z.nullable(z.string()),
            album: z.object({
              id: z.string(),
              name: z.string(),
              images: z.array(
                z.object({
                  url: z.string(),
                  height: z.number(),
                  width: z.number(),
                })
              ),
            }),
          }),
        })
      ),
    });
    return schema.parse(response).items.map((item) => item.track);
  },
});

type AudioFeaturesRequestInput = {
  trackIds: string[];
};
export const audioFeaturesRequest = buildSpotifyApiRequest({
  type: "GET",
  path: () => "/audio-features",
  urlParams: ({ trackIds }: AudioFeaturesRequestInput) => ({
    ids: trackIds.join(","),
  }),
  responseParser: (response) => {
    const schema = z.object({
      audio_features: z.array(
        z.object({
          id: z.string(),
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
        })
      ),
    });
    return schema.parse(response).audio_features;
  },
});

type PlaylistCreateRequestInput = {
  userId: string;
  playlistName: string;
};
export const playlistCreateRequest = buildSpotifyApiRequest({
  type: "POST",
  path: ({ userId }: PlaylistCreateRequestInput) =>
    `/users/${userId}/playlists`,
  body: ({ playlistName }: PlaylistCreateRequestInput) => ({
    name: playlistName,
    public: false,
    description: "Auto-generated by Spotify Filter",
  }),
  responseParser: (response) => {
    const schema = z.object({
      id: z.string(),
    });
    return schema.parse(response).id;
  },
});

type TrackAddRequestInput = {
  playlistId: string;
  trackUris: string[];
};
export const trackAddRequest = buildSpotifyApiRequest({
  type: "POST",
  path: ({ playlistId }: TrackAddRequestInput) =>
    `/playlists/${playlistId}/tracks`,
  body: ({ trackUris }: TrackAddRequestInput) => ({ uris: trackUris }),
  responseParser: z.unknown().parse,
});
