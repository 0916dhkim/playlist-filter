import {
  audioFeatureRangesSchema,
  calculateAudioFeatureRanges,
  filterByAudioFeatureRanges,
} from "./models";
import express, { Router } from "express";

import { FirebaseService } from "./services/firebase";
import { SpotifyService } from "./services/spotify";
import cors from "cors";
import morgan from "morgan";
import { parseJsonQuery } from "./lib/schema";
import secrets from "./secrets";
import { toPromise } from "./lib/observable";
import { validateFirebaseIdToken } from "./middleware";
import z from "zod";

const firebaseService = FirebaseService();
const spotifyService = SpotifyService(firebaseService);

const app = express();

app.use(morgan("short"));
app.use(cors());

const api = Router();
app.use("/api", api);
api.use(validateFirebaseIdToken);

api.get("/profile", async (req, res, next) => {
  try {
    const profile = await firebaseService.getProfile(req.uid);

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
      client_id: secrets.SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: `${secrets.APP_BASE_URL}/callback`,
      scope: "playlist-read-private playlist-modify-private",
    }).toString();

  return res.json({
    url: loginUrl,
  });
});

api.post("/connect-spotify", async (req, res, next) => {
  try {
    const { code } = req.body;
    if (typeof code !== "string") {
      return res.status(400).send("No code provided");
    }

    await spotifyService.connectSpotify(req.uid, code);

    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

api.get("/playlists", async (req, res, next) => {
  try {
    const playlists = await toPromise(
      spotifyService.getPlaylists(spotifyService.getValidToken(req.uid))
    );

    return res.json({
      playlists,
    });
  } catch (err) {
    return next(err);
  }
});

api.get("/playlists/:id", async (req, res, next) => {
  try {
    const playlist = await spotifyService.getPlaylist(
      spotifyService.getValidToken(req.uid),
      req.params.id
    );
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

api.get("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const tracks = await toPromise(
      spotifyService
        .getTracks(spotifyService.getValidToken(req.uid), req.params.id)
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
  try {
    const { playlistName, audioFeatureRanges } = z
      .object({
        playlistName: z.string(),
        audioFeatureRanges: audioFeatureRangesSchema,
      })
      .parse(req.body);
    const playlistId = await spotifyService.exportPlaylist(
      spotifyService.getValidToken(req.uid),
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
