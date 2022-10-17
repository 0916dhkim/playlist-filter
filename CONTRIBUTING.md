# Contribution Guideline

## Requirements

You need [pnpm](https://pnpm.io/) & [Java](https://www.oracle.com/java/technologies/downloads/) runtime installed on your machine.
Please confirm that you have those dependencies with the commands below:

```
pnpm --version
```

```
java --version
```

## How to Set up Your Development Environment

1. Create a Spotify app on your [Spotify developer dashboard](https://developer.spotify.com/dashboard/applications).
1. Add "http://localhost:5173/callback" to redirect URIs in your Spotify app settings. ([How to edit app settings](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/))
1. Fork this repository.
1. Clone your fork to your machine.
1. Create `.secret.local` file in `functions` directory. You can find the client ID & secret on your dashboard. Example:
   ```
   SPOTIFY_CLIENT_ID="your-spotify-client-id"
   SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
   ```
1. `pnpm i`
1. `pnpm dev`
