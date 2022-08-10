import { ReactElement, useEffect } from "react";

import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";

export default function Home(): ReactElement {
  const user = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) {
      navigate("/signin");
    }
  }, [user]);

  const handleSpotify = async () => {
    if (user == null) {
      throw new Error("User is not logged in");
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/spotify-login-url`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    const { url } = await response.json();
    window.location.href = url;
  };

  return <button onClick={handleSpotify}>Connect Spotify</button>;
}
