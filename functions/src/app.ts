import axios from "axios";
import cors from "cors";
import env from "./env";
import express from "express";
import { getToken } from "./spotify";
import { spotifyAuthCollection } from "./firebase";
import { validateFirebaseIdToken } from "./middleware";
import z from "zod";

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
    spotifyAuthCollection.doc(req.user.uid).set(
      {
        accessToken,
        refreshToken,
        expiresIn,
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
    const doc = await spotifyAuthCollection.doc(req.user.uid).get();
    const { accessToken } = z
      .object({
        accessToken: z.string(),
      })
      .parse(doc.data());

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

export default app;
