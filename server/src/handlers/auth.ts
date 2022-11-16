import { RequestHandler } from "express";
import { APP_BASE_URL, SPOTIFY_CLIENT_ID } from "../env";
import { SpotifyService } from "../services/spotify";

export const SpotifyLoginUrlHandler =
  (): RequestHandler => async (req, res, next) => {
    const loginUrl =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: `${APP_BASE_URL}/api/signin`,
        scope: "playlist-read-private playlist-modify-private",
      }).toString();

    return res.json({
      url: loginUrl,
    });
  };

export const SignInHandler =
  (spotify: SpotifyService): RequestHandler =>
  async (req, res, next) => {
    try {
      const { code, error } = req.query;
      if (error) {
        return res.status(500).send("Failed to login");
      }
      if (typeof code !== "string") {
        return res.status(400).send("No code provided");
      }

      const uid = await spotify.signIn(code);
      req.session.uid = uid;

      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  };

export const SignOutHandler = (): RequestHandler => async (req, res, next) => {
  req.session.destroy((err) => {
    if (err == null) {
      res.sendStatus(200);
    } else {
      next(err);
    }
  });
};
