import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import pkceChallenge from "pkce-challenge";
import { CLIENT_ID, AUTHORIZATION_ENDPOINT, TOKEN_ENDPOINT, REQUESTED_SCOPES } from "./config";
import { ApplicationDispatch, ApplicationState } from "./store";

/**
 * Get URI of the current page.
 */
function getCurrentPageUri() {
  return window.location.protocol + "//" + window.location.host + window.location.pathname;
}

/**
 * Generate a random string
 * to be used for Auth state.
 */
function generateRandomString() {
  let array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(
    array,
    dec => ("0" + dec.toString(16)).substr(-2)
  ).join("");
}

/**
 * Begin sign-in process.
 */
async function signIn() {
  const state = generateRandomString();
  localStorage.setItem("pkce-state", state);

  const { code_verifier, code_challenge } = pkceChallenge();
  localStorage.setItem("pkce-code-verifier", code_verifier);

  const url = new URL(AUTHORIZATION_ENDPOINT);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", CLIENT_ID);
  url.searchParams.append("state", state);
  url.searchParams.append("scope", REQUESTED_SCOPES);
  url.searchParams.append("redirect_uri", getCurrentPageUri());
  url.searchParams.append("code_challenge", code_challenge);
  url.searchParams.append("code_challenge_method", "S256");

  // Redirect to auth page.
  window.location.assign(url.toString());
}

/**
 * Discard user credentials.
 */
function signOut(dispatch: ApplicationDispatch) {
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  dispatch({ type: "SIGN_OUT" });
}

/**
 * Handle user redirected from auth server.
 */
async function handleAuthRedirect() {
  const params = new URL(window.location.href).searchParams;
  const code = params.get("code");
  const state = params.get("state");
  if (code) {
    // Verify state.
    if (localStorage.getItem("pkce-state") !== state) {
      throw new Error("Invalid state returned from auth server.");
    }

    const codeVerifier = localStorage.getItem("pkce-code-verifier");
    if (!codeVerifier) {
      throw new Error("Missing local code verifier.");
    }

    const body = new URLSearchParams();
    body.append("client_id", CLIENT_ID);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", getCurrentPageUri());
    body.append("code_verifier", codeVerifier);

    // Request access token.
    axios.post(
      TOKEN_ENDPOINT,
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    ).then(res => {
      localStorage.setItem("access-token", res.data.access_token);
      localStorage.setItem("access-token-expiry", (Date.now() + 1000 * parseFloat(res.data.expires_in)).toString());
      localStorage.setItem("refresh-token", res.data.refresh_token);
    }).catch(e => {
      console.error(e);
      alert("Login Failed.");
    }).finally(() => {
      window.location.href = getCurrentPageUri();
    });
  }
}

function checkSession(dispatch: ApplicationDispatch) {
  const accessToken = localStorage.getItem("access-token");
  const refreshToken = localStorage.getItem("refresh-token");
  const accessTokenExpiry = parseFloat(localStorage.getItem("access-token-expiry") || "");
  if (accessToken && refreshToken && accessTokenExpiry) {
    dispatch(
      {
        type: "SIGN_IN",
        value: { accessToken, accessTokenExpiry, refreshToken }
      }
    );
  }
}

export default function() {
  const signedIn = useSelector((state: ApplicationState) => state.signedIn);
  const dispatch = useDispatch<ApplicationDispatch>();


  // On load.
  useEffect(() => {
    handleAuthRedirect();
    checkSession(dispatch);
  }, [dispatch]);
  return (
    <div>
      {signedIn
        ? <button onClick={() => signOut(dispatch)}>Sign Out</button>
        : <button onClick={signIn}>Sign In</button>
      }
    </div>
  );
}