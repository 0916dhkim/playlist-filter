import axios from "axios";
import env from "./env";

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
