import Spotify from "spotify-web-api-js";
import axios from "axios";
import { store, Track } from "./store";
import { TOKEN_ENDPOINT, CLIENT_ID } from "./config";
const spotify = new Spotify();

/**
 * Asynchronously request new access token.
 * @param refreshToken Spotify refresh token
 */
async function requestRefresh(refreshToken: string) {
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
      type: "SIGN_IN",
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
  const state = store.getState();
  if (!state.signedIn) {
    throw new Error("Cannot get access token if signed out.");
  }
  const { accessToken, refreshToken, tokenIsRefreshing } = state;
  if (!tokenIsRefreshing) {
    // Start refreshing tokens unless already refreshing.
    requestRefresh(refreshToken);
  }
  return accessToken;
}

function splitIntoBatches<T>(arr: ReadonlyArray<T>, batchSize: number = 30): ReadonlyArray<ReadonlyArray<T>> {
  let i = 0;
  const ret: Array<Array<T>> = [];
  while (arr.length > i) {
    ret.push(arr.slice(i, i + batchSize));
    i += batchSize;
  }
  return ret;
}

export function getUserPlaylists() {
  spotify.setAccessToken(getAccessToken());
  return spotify.getUserPlaylists();
}

export async function getPlaylistTracks(playlistId: string): Promise<ReadonlyArray<Track>> {
  spotify.setAccessToken(getAccessToken());
  const trackIds = (await spotify.getPlaylistTracks(playlistId)).items.map(i => i.track.id);
  console.log(trackIds.length);
  const trackMap = new Map<string, Track>();
  const batches = splitIntoBatches(trackIds);
  await Promise.all(trackIds.map(async id => {
    try {
      const track = await spotify.getTrack(id);
      const features = await spotify.getAudioFeaturesForTrack(id);
      trackMap.set(id, {...track, ...features});
    } catch (e) {
      console.error(e);
      console.log(`Failed to fetch track ${id}. Skipping...`);
    }
  }));
  await Promise.all(batches.map(async batch => {
    try {
      const { tracks } = await spotify.getTracks([...batch]);
      const { audio_features } = await spotify.getAudioFeaturesForTracks([...batch]);
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i]) {
          trackMap.set(tracks[i].id, {...tracks[i], ...audio_features[i]});
        }
      }
    } catch (e) {
      console.log(`Failed to fetch batch ${batch}. Skipping...`);
    }
    return;
  }));
  return Array.from(trackMap.values());
}
