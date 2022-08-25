import axios from "axios";
import env from "./env";
import z from "zod";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

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

  const tokenResponse: TokenResponse = response.data; // TODO: validate
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

  const tokenResponse: TokenResponse = response.data; // TODO: validate
  return {
    accessToken: tokenResponse.access_token,
    expiresIn: tokenResponse.expires_in,
  };
}

export async function getPlaylists(accessToken: string) {
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

export async function getPlaylist(playlistId: string, accessToken: string) {
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

export async function getTracks(playlistId: string, accessToken: string) {
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

  return items.map((item) => item.track);
}
