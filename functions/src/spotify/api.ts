import {
  SpotifyApiAudioFeatures,
  SpotifyApiPlaylist,
  SpotifyApiPlaylistDetails,
  SpotifyApiTrack,
  SpotifyUser,
} from "./models";

import axios from "axios";
import env from "../env";
import z from "zod";

export async function getToken(code: string) {
  const form = new URLSearchParams();
  form.append("grant_type", "authorization_code");
  form.append("code", code);
  form.append("redirect_uri", `${env.APP_BASE_URL}/callback`);
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    form,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  const tokenResponse = z
    .object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number(),
    })
    .parse(response.data);
  return {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    expiresIn: tokenResponse.expires_in,
  };
}

export async function requestTokenRefresh(refreshToken: string) {
  const form = new URLSearchParams();
  form.append("grant_type", "refresh_token");
  form.append("refresh_token", refreshToken);
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    form,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  const tokenResponse = z
    .object({
      access_token: z.string(),
      expires_in: z.number(),
    })
    .parse(response.data);
  return {
    accessToken: tokenResponse.access_token,
    expiresIn: tokenResponse.expires_in,
  };
}

export async function getMe(accessToken: string): Promise<SpotifyUser> {
  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return z
    .object({
      id: z.string(),
      email: z.string(),
      images: z.array(
        z.object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        })
      ),
    })
    .parse(response.data);
}

export async function getPlaylists(
  accessToken: string
): Promise<SpotifyApiPlaylist[]> {
  const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: 50,
    },
  });

  const { items } = z
    .object({
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    })
    .parse(response.data);
  return items;
}

export async function getPlaylist(
  playlistId: string,
  accessToken: string
): Promise<SpotifyApiPlaylistDetails> {
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
      },
    }
  );

  return z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.nullable(z.string()),
      images: z.array(
        z.object({
          url: z.string(),
        })
      ),
    })
    .parse(response.data);
}

export async function getTracks(
  playlistId: string,
  accessToken: string
): Promise<SpotifyApiTrack[]> {
  // TODO: do actual batching.
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
      },
    }
  );

  const { items } = z
    .object({
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
    })
    .parse(response.data);

  const tracks = items.map((item) => item.track);
  return tracks;
}

export async function getBatchAudioFeatures(
  trackIds: string[],
  accessToken: string
): Promise<SpotifyApiAudioFeatures[]> {
  // TODO: do actual batching.
  const response = await axios.get(
    "https://api.spotify.com/v1/audio-features",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        ids: trackIds.join(","),
      },
    }
  );

  const { audio_features } = z
    .object({
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
    })
    .parse(response.data);

  return audio_features;
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  playlistName: string
): Promise<string> {
  const response = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: playlistName,
      public: false,
      description: "Auto-generated by Spotify Filter.",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const responseData = z
    .object({
      id: z.string(),
    })
    .parse(response.data);

  return responseData.id;
}

export async function addBatchTracks(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<void> {
  // TODO: do actual batching.
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    { uris: trackUris },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return;
}
