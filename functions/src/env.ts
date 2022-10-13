const requireEnv = (name: string, fallback?: string): string => {
  const value = process.env[name];
  if (typeof value !== "string") {
    if (fallback == null) {
      throw new Error(`Missing environment variable ${name}`);
    }
    return fallback;
  }
  return value;
};

export default {
  get APP_BASE_URL() {
    return requireEnv("APP_BASE_URL");
  },
  get SPOTIFY_CLIENT_ID() {
    return requireEnv("SPOTIFY_CLIENT_ID");
  },
  get SPOTIFY_CLIENT_SECRET() {
    return requireEnv("SPOTIFY_CLIENT_SECRET");
  },
  get CACHE_LIFESPAN() {
    return Number(requireEnv("CACHE_TTL", "3600"));
  },
};
