import Spotify from "spotify-web-api-js";
import axios from "axios";
import { store } from "./store";
import { TOKEN_ENDPOINT, CLIENT_ID } from "./config";
const spotify = new Spotify();

/**
 * Asynchronously request new access token.
 * @param refreshToken Spotify refresh token
 */
async function requestRefresh(refreshToken: string) {
  const { refreshingToken } = store.getState();
  if (refreshingToken) {
    return;
  }
  store.dispatch({ type: "BEGIN_TOKEN_REFRESH" });
  try {
    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refreshToken);
    body.append("client_id", CLIENT_ID);
    const response = await axios.post(
      TOKEN_ENDPOINT,
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
    const [nextAccessToken, nextRefreshToken] = [response.data.access_token, response.data.refresh_token];
    if (typeof nextAccessToken !== "string" || typeof nextRefreshToken !== "string") {
      throw new Error("Invalid response from auth server.");
    }
    localStorage.setItem("access-token", nextAccessToken);
    localStorage.setItem("refresh-token", nextRefreshToken);
    store.dispatch({
      type: "GET_CREDENTIALS",
      value: { accessToken: nextAccessToken, refreshToken: nextRefreshToken }
    });
  } catch (e) {
    console.error(e);
  }
  store.dispatch({ type: "END_TOKEN_REFRESH" });
}

/**
 * Get access token, and start token refresh.
 */
function getAccessToken() {
  const { credentials } = store.getState();
  if (!credentials) {
    return undefined;
  }
  const { accessToken, refreshToken } = credentials;
  requestRefresh(refreshToken);
  return accessToken;
}

export function getUserPlaylists() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Failed to get access token.");
  }
  spotify.setAccessToken(token);
  return spotify.getUserPlaylists();
}
