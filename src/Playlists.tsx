import React, { useEffect } from "react";
import { getUserPlaylists, getPlaylistTracks } from "./spotify";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationDispatch, SignedInState } from "./store";

export default function() {
  const playlists = useSelector((state: SignedInState) => state.playlists);
  const dispatch = useDispatch<ApplicationDispatch>();
  useEffect(() => {
    getUserPlaylists().then(res => {
      dispatch({ type: "SET_PLAYLISTS", value: res.items });
    });
  }, [dispatch]);

  async function selectPlaylist(id: string) {
    const tracks = await getPlaylistTracks(id);
    dispatch({ type: "SET_TRACKS", value: tracks });
  }

  return (
    <div>
      <h3>Playlists</h3>
      <table>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist.id} onClick={() => selectPlaylist(playlist.id)}>
              <td>{playlist.id}</td>
              <td>{playlist.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
