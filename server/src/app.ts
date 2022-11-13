import { APP_BASE_URL, SESSION_SECRET, SPOTIFY_CLIENT_ID } from "./env";
import {
  audioFeatureRangesSchema,
  calculateAudioFeatureRanges,
  filterByAudioFeatureRanges,
} from "./models";
import express, { Router } from "express";

import { DatabaseService } from "./services/database";
import { SpotifyService } from "./services/spotify";
import morgan from "morgan";
import { parseJsonQuery } from "./lib/schema";
import session from "express-session";
import { toPromise } from "./lib/observable";
import z from "zod";

const databaseService = DatabaseService();
const spotifyService = SpotifyService(databaseService);

const app = express();

app.use(morgan("short"));
app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {},
  })
);
app.use(express.json());

const api = Router();
app.use("/api", api);

api.get("/profile", async (req, res, next) => {
  if (req.session.uid == null) {
    return res.sendStatus(403);
  }
  try {
    const profile = await databaseService.getProfile(req.session.uid);

    return res.json({
      profile,
    });
  } catch (err) {
    return next(err);
  }
});

api.get("/spotify-login-url", (req, res) => {
  const loginUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: `${APP_BASE_URL}/callback`,
      scope: "playlist-read-private playlist-modify-private",
    }).toString();

  return res.json({
    url: loginUrl,
  });
});

api.post("/signin", async (req, res, next) => {
  try {
    const { code } = req.body;
    if (typeof code !== "string") {
      return res.status(400).send("No code provided");
    }

    const uid = await spotifyService.signIn(code);
    req.session.uid = uid;

    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

api.post("/signout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err == null) {
      res.sendStatus(200);
    } else {
      next(err);
    }
  });
});

api.get("/playlists", async (req, res, next) => {
  if (req.session.uid == null) {
    return res.sendStatus(403);
  }
  try {
    const playlists = await toPromise(
      spotifyService.getPlaylists(spotifyService.getValidToken(req.session.uid))
    );

    return res.json({
      playlists,
    });
  } catch (err) {
    return next(err);
  }
});

api.get("/playlists/:id", async (req, res, next) => {
  if (req.session.uid == null) {
    return res.sendStatus(403);
  }
  try {
    const playlist = await spotifyService.getPlaylist(
      spotifyService.getValidToken(req.session.uid),
      req.params.id
    );
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

api.get("/playlists/:id/tracks", async (req, res, next) => {
  if (req.session.uid == null) {
    return res.sendStatus(403);
  }
  try {
    const tracks = await toPromise(
      spotifyService
        .getTracks(spotifyService.getValidToken(req.session.uid), req.params.id)
        .pipe(
          filterByAudioFeatureRanges(
            parseJsonQuery(
              req.query.audioFeatureRanges,
              audioFeatureRangesSchema.nullish()
            ) ?? {}
          )
        )
    );
    const audioFeatureRanges = calculateAudioFeatureRanges(tracks);
    return res.json({
      tracks,
      audioFeatureRanges,
    });
  } catch (err) {
    return next(err);
  }
});

api.post("/playlists/:id/export", async (req, res, next) => {
  if (req.session.uid == null) {
    return res.sendStatus(403);
  }
  try {
    const { playlistName, audioFeatureRanges } = z
      .object({
        playlistName: z.string(),
        audioFeatureRanges: audioFeatureRangesSchema,
      })
      .parse(req.body);
    const playlistId = await spotifyService.exportPlaylist(
      spotifyService.getValidToken(req.session.uid),
      req.params.id,
      playlistName,
      audioFeatureRanges
    );
    return res.json({
      playlistId,
    });
  } catch (err) {
    return next(err);
  }
});

export default app;
