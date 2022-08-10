import type { NavigateFunction } from "react-router-dom";
import { useEffect } from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";

const connectSpotify = async (navigate: NavigateFunction, token: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    throw new Error(error);
  }
  if (code == null) {
    throw new Error("Callback page is requested without code");
  }

  await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/connect-spotify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  navigate("/");
};

export default function OAuthCallback() {
  const navigate = useNavigate();
  const user = useFirebaseAuth();
  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => connectSpotify(navigate, token));
    }
  }, [user]);
  return (
    <div>
      <h1>OAuthCallback</h1>
      {user ? <p>Connecting spotify</p> : <p>not logged in</p>}
    </div>
  );
}
