import { ReactElement } from "react";
import { getIdToken } from "../../firebase";
import { sprinkles } from "../../sprinkles.css";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

type PlaylistsProps = {
  onSelect: (playlistId: string) => void;
};

async function getPlaylists() {
  const idToken = await getIdToken();
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

export default function Playlists({ onSelect }: PlaylistsProps): ReactElement {
  const result = useQuery(["playlists"], () => getPlaylists());
  return (
    <div
      className={sprinkles({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })}
    >
      {result.data
        ? result.data.playlists.map((playlist) => (
            <span key={playlist.id} onClick={() => onSelect(playlist.id)}>
              {playlist.name}
            </span>
          ))
        : null}
    </div>
  );
}
