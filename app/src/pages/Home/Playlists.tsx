import { ReactElement } from "react";
import useFirebaseIdToken from "../../hooks/useFirebaseIdToken";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

async function getPlaylists(idToken?: string) {
  if (idToken == null) {
    throw new Error("No token");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/playlists`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  return z
    .object({
      playlists: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    })
    .parse(await response.json());
}

export default function Playlists(): ReactElement {
  const idToken = useFirebaseIdToken();
  const result = useQuery(["playlists", idToken], () => getPlaylists(idToken));
  return (
    <ul>
      {result.data
        ? result.data.playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))
        : null}
    </ul>
  );
}
