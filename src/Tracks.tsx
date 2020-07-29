import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { SignedInState } from "./store";

export default function() {
  const tracks = useSelector((state: SignedInState) => state.tracks);
  const minTempo = useSelector((state: SignedInState) => state.tempoRange[0]);
  const maxTempo = useSelector((state: SignedInState) => state.tempoRange[1]);

  const filteredTracks = useMemo(() => {
    return tracks.filter(track => track.tempo >= minTempo && track.tempo <= maxTempo);
  }, [tracks, minTempo, maxTempo]);
  return (
    <div>
      <h3>Tracks</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Tempo</th>
            <th>Danceability</th>
          </tr>
        </thead>
        <tbody>
          {filteredTracks.map(track => (
            <tr key={track.id}>
              <td>{track.id}</td>
              <td>{track.name}</td>
              <td>{track.tempo}</td>
              <td>{track.danceability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
