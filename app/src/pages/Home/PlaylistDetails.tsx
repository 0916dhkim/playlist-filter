import { container, thumbnail } from "./PlaylistDetails.css";

import { ReactElement } from "react";
import { getIdToken } from "../../firebase";
import { sprinkles } from "../../sprinkles.css";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

type PlayslistDetailsProps = {
  playlistId: string;
};

async function getPlaylistDetails(playlistId: string) {
  const idToken = await getIdToken();

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  return z
    .object({
      playlist: z.object({
        id: z.string(),
        name: z.string(),
        description: z.nullable(z.string()),
        images: z.array(
          z.object({
            url: z.string(),
          })
        ),
      }),
    })
    .parse(await response.json());
}

export default function PlaylistDetails({
  playlistId,
}: PlayslistDetailsProps): ReactElement {
  const result = useQuery(["playlistDetails", playlistId], () =>
    getPlaylistDetails(playlistId)
  );

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
