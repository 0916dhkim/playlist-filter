import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React, { useMemo } from "react";

import { PersonalPageState } from "../../state";
import { filterTracks } from "../../filterTracks";
import style from "./Tracks.module.scss";
import { useSelector } from "react-redux";

export default function() {
  const tracks = useSelector((state: PersonalPageState) => state.tracks);
  const range = useSelector((state: PersonalPageState) => state.audioFeatureRange);

  const trackMap = useMemo(
    () => new Map(tracks.map(track => [track.id, track])),
    [tracks]
  );

  const filteredTracks = useMemo(
    () => filterTracks(Array.from(trackMap.values()), range),
    [trackMap, range]
  );

  return (
    <Paper square>
      <h3>Tracks ({filteredTracks.length})</h3>
      <Table stickyHeader className={style.table}>
        <TableHead className={style.header}>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Artists</TableCell>
            <TableCell>Tempo</TableCell>
            <TableCell>Acousticness</TableCell>
            <TableCell>Danceability</TableCell>
            <TableCell>Energy</TableCell>
            <TableCell>Instrumentalness</TableCell>
            <TableCell>Liveness</TableCell>
            <TableCell>Loudness</TableCell>
            <TableCell>Speechiness</TableCell>
            <TableCell>Valence</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTracks.map(track => (
            <TableRow key={track.id}>
              <TableCell>{track.name}</TableCell>
              <TableCell>{track.artists.map(artist => artist.name).join(",")}</TableCell>
              <TableCell>{track.tempo}</TableCell>
              <TableCell>{track.acousticness}</TableCell>
              <TableCell>{track.danceability}</TableCell>
              <TableCell>{track.energy}</TableCell>
              <TableCell>{track.instrumentalness}</TableCell>
              <TableCell>{track.liveness}</TableCell>
              <TableCell>{track.loudness}</TableCell>
              <TableCell>{track.speechiness}</TableCell>
              <TableCell>{track.valence}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
