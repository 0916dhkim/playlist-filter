import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ExportPageState } from "../../state";
import { ApplicationDispatch } from "../../store";
import { createPlaylist } from "../../spotify";
import { useRefreshedSession } from "../../hooks/useRefreshedSession";
import { useCancelToken } from "../../hooks/useCancelToken";

export function ExportPage() {
  const refreshedSession = useRefreshedSession();
  const tracks = useSelector((state: ExportPageState) => state.tracks);
  const newPlaylistName = useSelector((state: ExportPageState) => state.newPlaylistName);
  const dispatch = useDispatch<ApplicationDispatch>();
  const cancelToken = useCancelToken();


  async function handleExport() {
    const { accessToken } = await refreshedSession;
    await createPlaylist(
      newPlaylistName,
      tracks.map(track => track.uri),
      accessToken,
      cancelToken
    );
    alert("Export Complete!");
  }

  return (
    <div>
      Export Page
      <p>New Playlist Name</p>
      <input type="text" value={newPlaylistName} onChange={e => dispatch({ type: "SET_NEW_PLAYLIST_NAME", value: e.target.value })} />
      <button onClick={handleExport}>Export</button>
    </div>
  );
}
