export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL ??
  "http://localhost:5001/spotify-filter-a4435/us-central1";

export const FIREBASE_API_KEY =
  import.meta.env.VITE_FIREBASE_API_KEY ??
  "AIzaSyD3CgLr9T5HqgqsLjjFZC25fNB10FQQECQ";

export const FIREBASE_AUTH_DOMAIN =
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
  "spotify-filter-a4435.firebaseapp.com";

export const FIREBASE_PROJECT_ID =
  import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "spotify-filter-a4435";

export const FIREBASE_STORAGE_BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
  "spotify-filter-a4435.appspot.com";

export const FIREBASE_MESSAGING_SENDER_ID =
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "425167261645";

export const FIREBASE_APP_ID =
  import.meta.env.VITE_FIREBASE_APP_ID ??
  "1:425167261645:web:e914d9a4c6cf3e61183e84";

export const DEV = import.meta.env.DEV;
