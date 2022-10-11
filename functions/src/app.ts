import { ALL_AUDIO_FEATURES, calculateAudioFeatureRanges } from "./models";

import { FirebaseService } from "./services/firebase";
import { SpotifyService } from "./services/spotify";
import cors from "cors";
import env from "./env";
import express from "express";
import morgan from "morgan";
import { stringLiteralUnion } from "./lib/schema";
import { toPromise } from "./lib/observable";
import { validateFirebaseIdToken } from "./middleware";
import z from "zod";

const firebaseService = FirebaseService();
const spotifyService = SpotifyService(firebaseService);

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

    await spotifyService.connectSpotify(req.uid, code);

    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists", async (req, res, next) => {
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

app.get("/playlists/:id", async (req, res, next) => {
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

app.get("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const tracks = await toPromise(
      spotifyService.getTracks(
        spotifyService.getValidToken(req.uid),
        req.params.id
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
    const playlistId = await spotifyService.exportPlaylist(
      spotifyService.getValidToken(req.uid),
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
