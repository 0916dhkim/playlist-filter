import {
  container,
  thumbnail,
  thumbnailPlaceholder,
} from "./PlaylistDetails.css";

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
  const thumbnailSrc = result.data?.images[0]?.url;

  return (
    <div className={container}>
      {thumbnailSrc ? (
        <img src={thumbnailSrc} className={thumbnail} />
      ) : (
        <div className={thumbnailPlaceholder} />
      )}
      <h1
        className={sprinkles({
          fontWeight: "bold",
          fontSize: "h1",
        })}
      >
        <a href={result.data?.externalUrls.spotify}>{result.data?.name}</a>
      </h1>
    </div>
  );
}
