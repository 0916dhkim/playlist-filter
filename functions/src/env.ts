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
  get SPOTIFY_LOGIN_REDIRECT_URI() {
    return requireEnv("SPOTIFY_LOGIN_REDIRECT_URI");
  },
};
