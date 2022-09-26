import { container, thumbnail } from "./PlaylistDetails.css";

import { ReactElement } from "react";
import { getPlaylistDetails } from "../../api/queries";
import { sprinkles } from "../../sprinkles.css";
import { useQuery } from "@tanstack/react-query";

type PlayslistDetailsProps = {
  playlistId: string;
};

export default function PlaylistDetails({
  playlistId,
}: PlayslistDetailsProps): ReactElement {
  const result = useQuery(...getPlaylistDetails(playlistId));

  return (
    <div className={container}>
      <img src={result.data?.images[0].url} className={thumbnail} />
      <h1
        className={sprinkles({
          fontWeight: "bold",
          fontSize: "h1",
        })}
      >
        {result.data?.name}
      </h1>
    </div>
  );
}
