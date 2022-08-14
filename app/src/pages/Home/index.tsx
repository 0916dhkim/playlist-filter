import { ReactElement, useEffect, useState } from "react";

import ConnectSpotifyButton from "../../components/ConnectSpotifyButton";
import PlaylistDetails from "./PlaylistDetails";
import Playlists from "./Playlists";
import Tracks from "./Tracks";
import { useFirebaseAuthState } from "../../firebase";
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

  return (
    <div>
      <ConnectSpotifyButton />
      <h1>Playlists</h1>
      <Playlists onSelect={handlePlaylistSelect} />
      {selectedPlaylistId ? (
        <>
          <PlaylistDetails playlistId={selectedPlaylistId} />
          <Tracks playlistId={selectedPlaylistId} />
        </>
      ) : null}
    </div>
  );
}
