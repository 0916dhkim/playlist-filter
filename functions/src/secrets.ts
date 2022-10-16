const requireSecret = (name: string, fallback?: string): string => {
  const value = process.env[name];
  if (typeof value !== "string") {
    if (fallback == null) {
      throw new Error(`Missing secret ${name}`);
    }
    return fallback;
  }
  return value;
};

export default {
  get APP_BASE_URL() {
    return requireSecret("APP_BASE_URL", "http://localhost:5173");
  },
  get SPOTIFY_CLIENT_ID() {
    return requireSecret("SPOTIFY_CLIENT_ID");
  },
  get SPOTIFY_CLIENT_SECRET() {
    return requireSecret("SPOTIFY_CLIENT_SECRET");
  },
  get CACHE_LIFESPAN() {
    return Number(requireSecret("CACHE_LIFESPAN", "3600"));
  },
};
