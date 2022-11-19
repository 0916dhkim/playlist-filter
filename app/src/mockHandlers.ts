import { rest, setupWorker } from "msw";

export const handlers = [
  rest.get("/api/profile", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        profile: {
          id: "123123",
          isConnectedToSpotify: false,
        },
      })
    );
  }),
  rest.get("/api/spotify-login-url", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ url: "https://spotify.com" }));
  }),
];

export const worker = setupWorker(...handlers);
