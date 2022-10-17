import app from "./app";
import { onRequest } from "firebase-functions/v2/https";
import secrets from "./secrets";

export const api = onRequest(
  { secrets: Object.getOwnPropertyNames(secrets) },
  app
);
