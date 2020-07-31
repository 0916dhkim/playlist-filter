import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { SignedInState } from "./store";
import style from "./Tracks.module.css";

export default function() {
  const tracks = useSelector((state: SignedInState) => state.tracks);
  const minTempo = useSelector((state: SignedInState) => state.tempoRange[0]);
  const maxTempo = useSelector((state: SignedInState) => state.tempoRange[1]);

  const trackMap = useMemo(
    () => new Map(tracks.map(track => [track.id, track])),
    [tracks]
  );

  const filteredTracks = useMemo(
    () => Array.from(trackMap.values()).filter(track => track.tempo >= minTempo && track.tempo <= maxTempo),
    [trackMap, minTempo, maxTempo]
  );

  return (
    <div>
      <h3>Tracks</h3>
      <table className={style.table}>
        <thead>
          <tr className={style.header}>
            <th>Title</th>
            <th>Tempo</th>
            <th>Acousticness</th>
            <th>Danceability</th>
            <th>Energy</th>
            <th>Instrumentalness</th>
            <th>Liveness</th>
            <th>Loudness</th>
            <th>Speechiness</th>
            <th>Valence</th>
          </tr>
        </thead>
        <tbody>
          {filteredTracks.map(track => (
            <tr key={track.id} className={style.row}>
              <td>{track.name}</td>
              <td>{track.tempo}</td>
              <td>{track.acousticness}</td>
              <td>{track.danceability}</td>
              <td>{track.energy}</td>
              <td>{track.instrumentalness}</td>
              <td>{track.liveness}</td>
              <td>{track.loudness}</td>
              <td>{track.speechiness}</td>
              <td>{track.valence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
