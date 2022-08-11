import { getToken, requestTokenRefresh } from "./spotify";

import axios from "axios";
import cors from "cors";
import env from "./env";
import express from "express";
import { spotifyAuthCollection } from "./firebase";
import { validateFirebaseIdToken } from "./middleware";
import z from "zod";

/**
 * Get an access token that is not expired.
 */
async function getValidToken(uid: string) {
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

    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );

    const { items } = z
      .object({
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
      .parse(response.data);

    return res.json({
      playlists: items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
      })),
    });
  } catch (err) {
    return next(err);
  }
});

app.get("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const accessToken = await getValidToken(req.user.uid);

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );

    const { items } = z
      .object({
        items: z.array(
          z.object({
            track: z.object({
              id: z.string(),
              name: z.string(),
              duration_ms: z.number(),
              preview_url: z.nullable(z.string()),
              album: z.object({
                id: z.string(),
                name: z.string(),
                images: z.array(
                  z.object({
                    url: z.string(),
                    height: z.number(),
                    width: z.number(),
                  })
                ),
              }),
            }),
          })
        ),
      })
      .parse(response.data);
    return res.json({
      tracks: items.map((item) => item.track),
    });
  } catch (err) {
    return next(err);
  }
});

export default app;
