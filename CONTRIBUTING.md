# Contribution Guideline

## Requirements

You need [pnpm](https://pnpm.io/) installed on your machine.

## How to Set up Your Development Environment

You need to set up both back-end & front-end to run this project locally.

### Back-end

1. Clone this repository.
1. Create a Spotify app on your [Spotify developer dashboard](https://developer.spotify.com/dashboard/applications).
1. Add "http://localhost:5173/callback" to redirect URIs in your Spotify app settings. ([How to edit app settings](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/))
1. Create `.secret.local` file in `functions` directory. You can find the client ID & secret on your dashboard. Example:
   ```
   SPOTIFY_CLIENT_ID="your-spotify-client-id"
   SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
   ```
1. Run `pnpm i` in `functions` directory.
1. Run `pnpm tsc --watch` in one terminal, and run `pnpm serve` in another terminal.

### Front-end

1. Run `pnpm i` in `app` directory.
1. Run `pnpm tsc --watch` in one terminal, and run `pnpm dev` in another terminal.
