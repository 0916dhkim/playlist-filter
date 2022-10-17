import { ReactElement, useEffect } from "react";
import { appAtom, selectPlaylistAtom } from "../../state/app";
import { useAtomValue, useSetAtom } from "jotai";

import EditorForm from "./EditorForm";
import PlaylistDetails from "./PlaylistDetails";
import Playlists from "./Playlists";
import { sprinkles } from "../../sprinkles.css";
import { twoColumns } from "./index.css";
import { useFirebaseAuthState } from "../../firebase";
import { useNavigate } from "react-router-dom";

/**
 * The main playlist editing page.
 *
 * The user must be authenticated & has their Spotify account connected
 * before reaching this page.
 */
export default function Home(): ReactElement {
  const hasAuth = useFirebaseAuthState();
  const navigate = useNavigate();
  const state = useAtomValue(appAtom);
  const selectPlaylist = useSetAtom(selectPlaylistAtom);

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
        <h4
          className={sprinkles({
            fontWeight: "bold",
            fontSize: "h4",
          })}
        >
          Playlists
        </h4>
        <Playlists onSelect={selectPlaylist} />
      </div>
      {state.selectedPlaylistId ? (
        <div
          className={sprinkles({
            display: "flex",
            flexDirection: "column",
            padding: "xl",
            gap: "xl",
          })}
        >
          <PlaylistDetails playlistId={state.selectedPlaylistId} />
          <EditorForm
            playlistId={state.selectedPlaylistId}
            formMolecule={state.formMolecule}
          />
        </div>
      ) : null}
    </div>
  );
}
