import React, { useEffect } from "react";
import { getUserPlaylists, getPlaylistTracks } from "./spotify";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationDispatch, SignedInState } from "./store";
import useAccessToken from "./useAccessToken";

export default function() {
  const accessToken = useAccessToken();
  const playlists = useSelector((state: SignedInState) => state.playlists);
  const dispatch = useDispatch<ApplicationDispatch>();
  useEffect(() => {
    accessToken.then(t => getUserPlaylists(t)).then(playlists => {
      dispatch({
        type: "SET_PLAYLISTS",
        value: playlists
      });
    }).catch(e => {
      console.error(`Failed to fetch user playlists: ${e}`);
    });
  }, [accessToken, dispatch]);

  async function selectPlaylist(id: string) {
    const tracks = await getPlaylistTracks(id, await accessToken);
    dispatch({
      type: "SET_TRACKS",
      value: tracks
    });
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
