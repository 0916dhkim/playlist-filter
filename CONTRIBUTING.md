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

## Project Structure

### Front-end

- api: contains REST API specifications, predefined queries & mutations for `react-query`.
- components: contains shared React components.
- pages: contains page components and page-specific components.
- state: contains application state management logic.

### Back-end

- handlers: contains request handlers.
- lib: contains reusable low level code.
- services: a service is a reusable piece of high-level code. The majority of business logic resides inside services. Request handlers can consume services through `ServiceProvider`.
- test: contains integration tests.

## Code Style Guide

### Front-end

- Please write CSS styles with `@vanilla-extract/css`. You can find examples in `*.css.ts` files in this project.
- Please use `Atom` suffix for jotai atoms (e.g. `inputAtom`).
- A group of atoms should be called `Molecule` (e.g. `RangeInputMolecule`).

### Back-end

- Please use `$` suffix for Promises and Observables (e.g. `const playlists$: Promise<Playlist[]>`).
