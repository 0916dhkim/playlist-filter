import cors from "cors";
import env from "./env";
import express from "express";
import { getToken } from "./spotify";
import { spotifyAuthCollection } from "./firebase";
import { validateFirebaseIdToken } from "./middleware";

const app = express();

app.use(cors());
app.use(validateFirebaseIdToken);

app.get("/login", (req, res) => {
  const loginUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      client_id: env.SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: env.SPOTIFY_LOGIN_REDIRECT_URI,
    }).toString();

  return res.json({
    url: loginUrl,
  });
});

app.get("/auth-callback", async (req, res, next) => {
  try {
    const { code, error } = req.query;
    if (typeof error === "string") {
      return next(error);
    }
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

    res.redirect(env.APP_BASE_URL);
  } catch (err) {
    next(err);
  }
});

export default app;
