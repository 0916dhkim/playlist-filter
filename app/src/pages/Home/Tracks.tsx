import { ReactElement } from "react";
import { getIdToken } from "../../firebase";
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
    <ul>
      {result.data
        ? result.data.tracks.map((track, index) => (
            <li key={`${index}-${track.id}`}>{track.name}</li>
          ))
        : null}
    </ul>
  );
}
