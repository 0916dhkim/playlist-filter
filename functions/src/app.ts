import { ALL_AUDIO_FEATURES, calculateAudioFeatureRanges } from "./models";
import { connectSpotify, getValidToken } from "./services/firebase";
import {
  exportPlaylist,
  getPlaylist,
  getPlaylists,
  getTracks,
} from "./services/spotify";

import cors from "cors";
import env from "./env";
import express from "express";
import morgan from "morgan";
import { stringLiteralUnion } from "./lib/schema";
import { toPromise } from "./lib/observable";
import { validateFirebaseIdToken } from "./middleware";
import z from "zod";

const app = express();

app.use(morgan("short"));
app.use(cors());
app.use(validateFirebaseIdToken);

app.get("/spotify-login-url", (req, res) => {
  const loginUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      client_id: env.SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: `${env.APP_BASE_URL}/callback`,
      scope: "playlist-read-private",
    }).toString();

  return res.json({
    url: loginUrl,
  });
});

app.post("/connect-spotify", async (req, res, next) => {
  try {
    const { code } = req.body;
    if (typeof code !== "string") {
      return res.status(400).send("No code provided");
    }

    await connectSpotify(req.uid, code);

    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.uid);
    const playlists = await toPromise(getPlaylists(accessToken));

    return res.json({
      playlists,
    });
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists/:id", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.uid);
    const playlist = await getPlaylist(accessToken, req.params.id);
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.uid);
    const tracks = await toPromise(getTracks(accessToken, req.params.id));
    const audioFeatureRanges = calculateAudioFeatureRanges(tracks);
    return res.json({
      tracks,
      audioFeatureRanges,
    });
  } catch (err) {
    return next(err);
  }
});

app.post("/playlists/:id/export", async (req, res, next) => {
  try {
    const { playlistName, filter } = z
      .object({
        playlistName: z.string(),
        filter: z.record(
          stringLiteralUnion(...ALL_AUDIO_FEATURES),
          z.object({
            min: z.number(),
            max: z.number(),
          })
        ),
      })
      .parse(req.body);
    const accessToken = await getValidToken(req.uid);
    const playlistId = await exportPlaylist(
      accessToken,
      req.params.id,
      playlistName,
      filter
    );
    return res.json({
      playlistId,
    });
  } catch (err) {
    return next(err);
  }
});

export default app;
