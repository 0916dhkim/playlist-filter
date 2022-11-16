import { EnvService } from ".";

export const MockEnvService = (): EnvService => ({
  APP_BASE_URL: "",
  CACHE_LIFESPAN: "",
  MONGO_URI: "",
  PORT: "",
  SESSION_SECRET: "",
  SPOTIFY_CLIENT_ID: "",
  SPOTIFY_CLIENT_SECRET: "",
});
