import {
  calculateAudioFeatureRanges,
  playlistFilterSchema,
} from "./domainModels";
import {
  exportPlaylist,
  getPlaylist,
  getPlaylists,
  getTokenWithAuthorizationCode,
  getTracks,
} from "./services/spotify";
import { from, lastValueFrom, toArray } from "rxjs";

import cors from "cors";
import env from "./env";
import express from "express";
import morgan from "morgan";
import { runRequest } from "./request";
import { spotifyAuthCollection } from "./firebase";
import { tokenRefreshRequest } from "./services/spotify/api";
import { validateFirebaseIdToken } from "./middleware";
import z from "zod";

/**
 * Get an access token that is not expired.
 */
async function getValidToken(uid: string): Promise<string> {
  const docRef = spotifyAuthCollection.doc(uid);
  const doc = await docRef.get();
  const now = Math.floor(new Date().getTime() / 1000);
  const { accessToken, refreshToken, expiresAt } = z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
      expiresAt: z.number(),
    })
    .parse(doc.data());
  if (expiresAt <= now) {
    const refreshed = await runRequest(tokenRefreshRequest, { refreshToken });
    await docRef.set(
      {
        accessToken: refreshed.accessToken,
        expiresAt: now + refreshed.expiresIn,
      },
      { merge: true }
    );
    return refreshed.accessToken;
  }
  return accessToken;
}

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

    const { accessToken, refreshToken, expiresIn } =
      await getTokenWithAuthorizationCode(code);
    const now = Math.floor(new Date().getTime() / 1000);
    spotifyAuthCollection.doc(req.user.uid).set(
      {
        accessToken,
        refreshToken,
        expiresAt: now + expiresIn,
      },
      { merge: true }
    );

    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.user.uid);
    const playlists = await lastValueFrom(
      from(getPlaylists(accessToken)).pipe(toArray())
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
    const accessToken = await getValidToken(req.user.uid);
    const playlist = await getPlaylist(accessToken, req.params.id);
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.user.uid);
    const tracks = await lastValueFrom(
      getTracks(accessToken, req.params.id).pipe(toArray())
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
        filter: playlistFilterSchema,
      })
      .parse(req.body);
    const accessToken = await getValidToken(req.user.uid);
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
