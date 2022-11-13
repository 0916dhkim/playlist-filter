import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value == null) {
    throw new Error(`Missing env var ${name}`);
  }
  return value;
}

export const APP_BASE_URL = process.env.APP_BASE_URL ?? "http://localhost:5173";
export const CACHE_LIFESPAN = process.env.CACHE_LIFESPAN ?? "3600";
export const MONGO_URI = requireEnv("MONGO_URI");
export const PORT = process.env.PORT ?? "5000";
export const SESSION_SECRET = requireEnv("SESSION_SECRET");
export const SPOTIFY_CLIENT_ID = requireEnv("SPOTIFY_CLIENT_ID");
export const SPOTIFY_CLIENT_SECRET = requireEnv("SPOTIFY_CLIENT_SECRET");
