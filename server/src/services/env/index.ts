import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value == null) {
    if (fallback == null) {
      throw new Error(`Missing env var ${name}`);
    }
    return fallback;
  }
  return value;
}

export const EnvService = () => {
  dotenv.config();

  return {
    APP_BASE_URL: requireEnv("APP_BASE_URL", "http://localhost:5173"),
    CACHE_LIFESPAN: requireEnv("CACHE_LIFESPAN", "3600"),
    MONGO_URI: requireEnv("MONGO_URI"),
    PORT: requireEnv("PORT", "5001"),
    SESSION_SECRET: requireEnv("SESSION_SECRET"),
    SPOTIFY_CLIENT_ID: requireEnv("SPOTIFY_CLIENT_ID"),
    SPOTIFY_CLIENT_SECRET: requireEnv("SPOTIFY_CLIENT_SECRET"),
  };
};

export type EnvService = ReturnType<typeof EnvService>;
