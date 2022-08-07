import * as functions from "firebase-functions";

import app from "./app";

export const spotifyFilter = functions.https.onRequest(app);
