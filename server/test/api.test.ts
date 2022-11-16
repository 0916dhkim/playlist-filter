import { APP_BASE_URL, SPOTIFY_CLIENT_ID } from "../src/env";

import request from "supertest";
import { App } from "../src/app";
import { ServiceProvider } from "../src/services";

import MockDatabaseService from "../src/services/database/mock";
import {
  MockSessionMiddleware,
  MockSessionService,
} from "../src/services/session/mock";
import { Profile } from "../src/models";
import { DatabaseService } from "../src/services/database";
import { SessionService } from "../src/services/session";

let mockDatabase: jest.Mocked<DatabaseService>;
let mockSession: jest.Mocked<SessionService>;
let testApp: App;

beforeEach(() => {
  mockDatabase = MockDatabaseService();
  mockSession = MockSessionService();
  testApp = App(
    ServiceProvider({
      database: mockDatabase,
      session: mockSession,
    })
  );
});

test("/api/spotify-login-url", async () => {
  const res = await request(testApp).get("/api/spotify-login-url");
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

test("/api/profile", async () => {
  const uid = "PROFILE-TEST";
  mockSession.middleware.mockImplementation(MockSessionMiddleware({ uid }));
  const expected: Profile = {
    id: uid,
    isConnectedToSpotify: false,
  };
  mockDatabase.getProfile.mockImplementation(() => Promise.resolve(expected));
  const res = await request(testApp).get("/api/profile");
  expect(res.body).toEqual({ profile: expected });
});
