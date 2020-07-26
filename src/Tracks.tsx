import React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "./store";

export default function() {
  const tracks = useSelector((state: ApplicationState) => state.tracks);
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
          {tracks.map(track => (
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
