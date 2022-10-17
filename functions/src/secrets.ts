const IS_EMULATOR = process.env.FUNCTIONS_EMULATOR === "true";

const requireSecret = (name: string, emulatorValue?: string): string => {
  if (IS_EMULATOR) {
    if (emulatorValue != null) {
      return emulatorValue;
    }
  }

  const value = process.env[name];
  if (typeof value !== "string") {
    throw new Error(`Missing secret ${name}`);
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
