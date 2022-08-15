import { ReactElement } from "react";
import { getIdToken } from "../../firebase";
import { list } from "./Tracks.css";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

type TracksProps = {
  playlistId: string;
};

async function getTracks(playlistId: string) {
  const idToken = await getIdToken();

  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_BASE_URL
    }/api/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  return z
    .object({
      tracks: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    })
    .parse(await response.json());
}

export default function Tracks({ playlistId }: TracksProps): ReactElement {
  const result = useQuery(["tracks", playlistId], () => getTracks(playlistId));
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
