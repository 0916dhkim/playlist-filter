import { ReactElement } from "react";
import { getTracks } from "../../api/queries";
import { list } from "./Tracks.css";
import { useQuery } from "@tanstack/react-query";

type TracksProps = {
  playlistId: string;
};

export default function Tracks({ playlistId }: TracksProps): ReactElement {
  const result = useQuery(...getTracks(playlistId));
  return (
    <div className={list}>
      {result.data
        ? result.data.tracks.map((track, index) => (
            <span key={`${index}-${track.id}`}>{track.name}</span>
          ))
        : null}
    </div>
  );
}
