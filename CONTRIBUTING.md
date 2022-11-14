# Contribution Guideline

## Requirements

- You need [pnpm](https://pnpm.io/) installed on your machine.
- This app requires MongoDB database.
  - Follow this [installation guide](https://www.mongodb.com/docs/manual/administration/install-community/)
  - Or if you have docker on your machine, you can run this command: `docker run -it --rm -p 27017:27017 mongo`

## How to Set up Your Development Environment

1. Create a Spotify app on your [Spotify developer dashboard](https://developer.spotify.com/dashboard/applications).
1. Add "http://localhost:5173/api/signin" to redirect URIs in your Spotify app settings. ([How to edit app settings](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/))
1. Fork this repository.
1. Clone your fork to your machine.
1. Create `.env` file in `server` directory. You can find an example env file at `server/.env.sample`.
1. `pnpm i`
1. `pnpm dev`
