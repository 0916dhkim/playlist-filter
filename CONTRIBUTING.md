# Contribution Guideline

## Requirements

- You need to have `pnpm` installed on your machine.
- You need a Firebase account.

## Local Setup for Developers

1. Clone this repository.
1. Create a Firebase project.
1. Add a web app to the Firebase project.
1. Enable "Email/Password" & "Anonymous" sign-in method on Firebase dashboard.
1. Create a Spotify app.
1. Add "http://localhost:5173/callback" to redirect URIs on Spotify developer dashboard.

### Server

1. `cd functions`
1. Create `.env.local` file in `functions` directory. Check [env.ts](./functions/src/env.ts) file for required variables.
1. `pnpm i`
1. `pnpm firebase login`
1. `pnpm firebase use <firebase-project-id>` Use the project ID of the Firebase project you created.
1. Run `pnpm tsc --watch` in one terminal, and run `pnpm serve` in another terminal.

### Web

1. `cd app`
1. Create `.env` file in `app` directory. Check [firebase.ts](./app/src/firebase.ts) file for required variables.
1. `pnpm i`
1. Run `pnpm tsc --watch` in one terminal, and run `pnpm dev` in another terminal.
