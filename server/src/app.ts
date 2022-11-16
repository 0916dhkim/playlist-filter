import express, { Router } from "express";

import morgan from "morgan";
import {
  SignInHandler,
  SignOutHandler,
  SpotifyLoginUrlHandler,
} from "./handlers/auth";
import {
  ExportPlaylistHandler,
  PlaylistDetailHandler,
  PlaylistsHandler,
  PlaylistTracksHandler,
} from "./handlers/playlist";
import { ProfileHandler } from "./handlers/profile";
import { ServiceProvider } from "./services";

export function App(service: ServiceProvider = ServiceProvider()) {
  const app = express();

  app.use(morgan("short"));
  app.use(service("session").middleware);
  app.use(express.json());

  const api = Router();
  app.use("/api", api);

  api.get("/profile", ProfileHandler(service("database")));
  api.get("/spotify-login-url", SpotifyLoginUrlHandler());
  api.get("/signin", SignInHandler(service("spotify")));
  api.post("/signout", SignOutHandler());
  api.get("/playlists", PlaylistsHandler(service("spotify")));
  api.get("/playlists/:id", PlaylistDetailHandler(service("spotify")));
  api.get("/playlists/:id/tracks", PlaylistTracksHandler(service("spotify")));
  api.post("/playlists/:id/export", ExportPlaylistHandler(service("spotify")));

  return app;
}

export type App = ReturnType<typeof App>;
