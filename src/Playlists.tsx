import React, { useEffect } from "react";
import { getUserPlaylists } from "./spotify";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationState, ApplicationDispatch } from "./store";

export default function() {
  const playlists = useSelector((state: ApplicationState) => state.playlists);
  const dispatch = useDispatch<ApplicationDispatch>();
  useEffect(() => {
    getUserPlaylists().then(res => {
      dispatch({ type: "SET_PLAYLISTS", value: res.items });
    });
  }, [dispatch]);
  return (
    <div>
      <h3>Playlists</h3>
      <table>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist.id}>
              <td>{playlist.id}</td>
              <td>{playlist.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
