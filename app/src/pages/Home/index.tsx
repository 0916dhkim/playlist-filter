import { ReactElement, useEffect, useState } from "react";
import { getIdToken, useFirebaseAuthState } from "../../firebase";

import Playlists from "./Playlists";
import Tracks from "./Tracks";
import { useNavigate } from "react-router-dom";

export default function Home(): ReactElement {
  const hasAuth = useFirebaseAuthState();
  const navigate = useNavigate();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );

  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };

  useEffect(() => {
    if (!hasAuth) {
      navigate("/signin");
    }
  }, [hasAuth]);

  const handleSpotify = async () => {
    const idToken = await getIdToken();
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

  return (
    <div>
      <button onClick={handleSpotify}>Connect Spotify</button>
      <h1>Playlists</h1>
      <Playlists onSelect={handlePlaylistSelect} />
      {selectedPlaylistId ? (
        <>
          <h1>Tracks</h1>
          <Tracks playlistId={selectedPlaylistId} />
        </>
      ) : null}
    </div>
  );
}
