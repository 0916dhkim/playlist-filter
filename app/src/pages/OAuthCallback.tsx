import { connectSpotify, useFirebaseAuthState } from "../firebase";

import type { NavigateFunction } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const handleOAuthCallback = async (navigate: NavigateFunction) => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    throw new Error(error);
  }
  if (code == null) {
    throw new Error("Callback page is requested without code");
  }

  await connectSpotify(code);

  navigate("/");
};

export default function OAuthCallback() {
  const navigate = useNavigate();
  const hasAuth = useFirebaseAuthState();

  useEffect(() => {
    handleOAuthCallback(navigate);
  }, []);

  return (
    <div>
      <h1>OAuthCallback</h1>
      {hasAuth ? <p>Connecting spotify</p> : <p>not logged in</p>}
    </div>
  );
}
