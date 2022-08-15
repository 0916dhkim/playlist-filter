import { ReactElement, useEffect, useState } from "react";

import ConnectSpotifyButton from "../../components/ConnectSpotifyButton";
import PlaylistDetails from "./PlaylistDetails";
import Playlists from "./Playlists";
import Tracks from "./Tracks";
import { sprinkles } from "../../sprinkles.css";
import { twoColumns } from "./index.css";
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
    <div className={twoColumns}>
      <div
        className={sprinkles({
          display: "flex",
          flexDirection: "column",
          padding: "lg",
          gap: "lg",
          background: {
            lightMode: "zinc50",
            darkMode: "zinc900",
          },
        })}
      >
        <ConnectSpotifyButton />
        <h4
          className={sprinkles({
            fontWeight: "bold",
            fontSize: "h4",
          })}
        >
          Playlists
        </h4>
        <Playlists onSelect={handlePlaylistSelect} />
      </div>
      {selectedPlaylistId ? (
        <div
          className={sprinkles({
            display: "flex",
            flexDirection: "column",
            padding: "xl",
            gap: "xl",
          })}
        >
          <PlaylistDetails playlistId={selectedPlaylistId} />
          <Tracks playlistId={selectedPlaylistId} />
        </div>
      ) : null}
    </div>
  );
}
