import { ReactElement, useEffect } from "react";

import useFirebaseIdToken from "../hooks/useFirebaseIdToken";
import { useNavigate } from "react-router-dom";

export default function Home(): ReactElement {
  const idToken = useFirebaseIdToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (idToken == null) {
      navigate("/signin");
    }
  }, [idToken]);

  const handleSpotify = async () => {
    if (idToken == null) {
      throw new Error("User is not logged in");
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/spotify-login-url`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    const { url } = await response.json();
    window.location.href = url;
  };

  return <button onClick={handleSpotify}>Connect Spotify</button>;
}
