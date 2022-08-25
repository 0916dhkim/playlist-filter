import { ReactElement } from "react";
import { list } from "./Tracks.css";
import { useTracksQuery } from "../../api/hooks";

type TracksProps = {
  playlistId: string;
};

export default function Tracks({ playlistId }: TracksProps): ReactElement {
  const result = useTracksQuery(playlistId);
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
