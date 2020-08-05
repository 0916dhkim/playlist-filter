import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { SignedInState, TrackInfo, AudioFeatureRange } from "../../store";
import style from "./Tracks.module.scss";
import { AudioFeatureKey } from "../../spotify_types";

function validateTrack(track: TrackInfo, range: AudioFeatureRange): boolean {
  for (const feature of AudioFeatureKey) {
    if (track[feature] < range[feature][0] || track[feature] > range[feature][1]) {
      return false;
    }
  }
  return true;
}

export default function() {
  const tracks = useSelector((state: SignedInState) => state.tracks);
  const range = useSelector((state: SignedInState) => state.audioFeatureRange);

  const trackMap = useMemo(
    () => new Map(tracks.map(track => [track.id, track])),
    [tracks]
  );

  const filteredTracks = useMemo(
    () => Array.from(trackMap.values()).filter(track => validateTrack(track, range)),
    [trackMap, range]
  );

  return (
    <div>
      <h3>Tracks ({filteredTracks.length})</h3>
      <table className={style.table}>
        <thead>
          <tr className={style.header}>
            <th>Title</th>
            <th>Artists</th>
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
              <td>{track.artists.map(artist => artist.name).join(",")}</td>
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
