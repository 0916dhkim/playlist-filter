import { ReactElement, useEffect, useState } from "react";
import { appAtom, selectPlaylistAtom } from "../../state/app";
import { useAtomValue, useSetAtom } from "jotai";

import ConnectSpotifyButton from "../../components/ConnectSpotifyButton";
import FilterForm from "./FilterForm";
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
        <ConnectSpotifyButton />
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
          <FilterForm
            playlistId={state.selectedPlaylistId}
            formMolecule={state.formMolecule}
          />
          <Tracks playlistId={state.selectedPlaylistId} />
        </div>
      ) : null}
    </div>
  );
}
