import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { CLIENT_ID, TOKEN_ENDPOINT} from "./config";
import { SignedInState, ApplicationDispatch } from "./store";

/**
 * Asynchronously request new access token.
 * @param refreshToken Spotify refresh token
 */
async function requestRefresh(refreshToken: string) {
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
  const [nextAccessToken, nextRefreshToken, nextTtl] = [response.data.access_token, response.data.refresh_token, response.data.expires_in];
  const nextAccessTokenExpiry = Date.now() + 1000 * parseFloat(nextTtl);
  if (typeof nextAccessToken !== "string" || typeof nextRefreshToken !== "string" || isNaN(nextAccessTokenExpiry)) {
    throw new Error("Invalid response from auth server.");
  }
  localStorage.setItem("access-token", nextAccessToken);
  localStorage.setItem("access-token-expiry", nextAccessTokenExpiry.toString());
  localStorage.setItem("refresh-token", nextRefreshToken);
  return {
    accessToken: nextAccessToken,
    accessTokenExpiry: nextAccessTokenExpiry,
    refreshToken: nextRefreshToken
  };
}

/**
 * React hook for getting access token.
 * This hook tries to refresh token if original access token is expired.
 */
function useAccessToken(): Promise<string> {
  const accessToken =  useSelector((state: SignedInState) => state.accessToken);
  const accessTokenExpiry = useSelector((state: SignedInState) => state.accessTokenExpiry);
  const refreshToken = useSelector((state: SignedInState) => state.refreshToken);
  const dispatch = useDispatch<ApplicationDispatch>();

  if (accessTokenExpiry < Date.now()) {
    // Access token is expired.
    // Refresh token.
    return requestRefresh(refreshToken)
      .then(res => {
        // Token refresh successful.
        dispatch({
          type: "SIGN_IN",
          value: res
        });
        return res.accessToken;
      })
      .catch((e) => {
        // Failed to refresh access token.
        console.error(`Failed to refresh access token: ${e}`);
        // Return original token.
        return accessToken;
      });
  }
  // Access token is still valid.
  return Promise.resolve(accessToken);
}

export default useAccessToken;
