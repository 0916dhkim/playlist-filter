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
  rest.get("/api/playlists", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        playlists: [
          {
            id: "test-1",
            name: "First Playlist",
          },
          {
            id: "test-2",
            name: "Second Playlist",
          },
          {
            id: "test-3",
            name: "Favorites",
          },
          {
            id: "test-4",
            name: "Focus",
          },
          {
            id: "test-5",
            name: "Workout",
          },
        ],
      })
    );
  }),
];

export const worker = setupWorker(...handlers);
