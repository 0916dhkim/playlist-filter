import { APP_BASE_URL, SPOTIFY_CLIENT_ID } from "../src/env";

import app from "../src/app";
import request from "supertest";

test("/api/spotify-login-url", async () => {
  const res = await request(app).get("/api/spotify-login-url");
  expect(res.body).toHaveProperty("url");
  const url = new URL(res.body.url);
  expect(url.protocol).toBe("https:");
  expect(url.host).toBe("accounts.spotify.com");
  expect(url.pathname).toBe("/authorize");
  expect(url.searchParams.get("client_id")).toBe(SPOTIFY_CLIENT_ID);
  expect(url.searchParams.get("response_type")).toBe("code");
  expect(url.searchParams.get("redirect_uri")).toBe(
    `${APP_BASE_URL}/api/signin`
  );
  const actualScope = new Set(url.searchParams.get("scope")?.split(" "));
  const expectedScope = new Set([
    "playlist-read-private",
    "playlist-modify-private",
  ]);
  expect(actualScope).toEqual(expectedScope);
});
