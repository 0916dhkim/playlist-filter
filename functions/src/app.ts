import {
  addBatchTracks,
  createPlaylist,
  getBatchAudioFeatures,
  getMe,
  getPlaylist,
  getPlaylists,
  getToken,
  getTracks,
  requestTokenRefresh,
} from "./spotify/api";
import {
  assembleTracks,
  calculateAudioFeatureRanges,
  filterPlaylist,
  playlistFilterSchema,
} from "./domainModels";

import cors from "cors";
import env from "./env";
import express from "express";
import morgan from "morgan";
import { spotifyAuthCollection } from "./firebase";
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
    const refreshed = await requestTokenRefresh(refreshToken);
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

    const { accessToken, refreshToken, expiresIn } = await getToken(code);
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
    const playlists = await getPlaylists(accessToken);

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
    const playlist = await getPlaylist(req.params.id, accessToken);
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.user.uid);
    const rawTracks = await getTracks(req.params.id, accessToken);
    const audioFeatures = await getBatchAudioFeatures(
      rawTracks.map((track) => track.id),
      accessToken
    );
    const tracks = assembleTracks(rawTracks, audioFeatures);
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
    const me = await getMe(accessToken);
    const rawTracks = await getTracks(req.params.id, accessToken);
    const audioFeatures = await getBatchAudioFeatures(
      rawTracks.map((track) => track.id),
      accessToken
    );
    const trackUrisToBeAdded = filterPlaylist(rawTracks, audioFeatures, filter);

    const playlistId = await createPlaylist(accessToken, me.id, playlistName);
    await addBatchTracks(accessToken, playlistId, trackUrisToBeAdded);

    return res.json({
      playlistId,
    });
  } catch (err) {
    return next(err);
  }
});

export default app;
