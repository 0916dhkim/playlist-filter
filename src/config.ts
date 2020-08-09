/**
 * Spotify application client id.
 */
export const CLIENT_ID = "7a3bed1acbc948829fdb043e52b845b8";

/**
 * Spotify authorization endpoint.
 */
export const AUTHORIZATION_ENDPOINT = "https://accounts.spotify.com/authorize";

/**
 * Spotify token endpoint.
 */
export const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

/**
 * Spotify API root.
 */
export const API_ROOT = "https://api.spotify.com/v1";

/**
 * Space separated list of scopes.
 */
export const REQUESTED_SCOPES = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public"
].join(" ");

