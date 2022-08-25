import { container, thumbnail } from "./PlaylistDetails.css";

import { ReactElement } from "react";
import { sprinkles } from "../../sprinkles.css";
import { usePlaylistDetailsQuery } from "../../api/hooks";

type PlayslistDetailsProps = {
  playlistId: string;
};

export default function PlaylistDetails({
  playlistId,
}: PlayslistDetailsProps): ReactElement {
  const result = usePlaylistDetailsQuery(playlistId);

  return (
    <div className={container}>
      <img src={result.data?.playlist.images[0].url} className={thumbnail} />
      <h1
        className={sprinkles({
          fontWeight: "bold",
          fontSize: "h1",
        })}
      >
        {result.data?.playlist.name}
      </h1>
    </div>
  );
}
