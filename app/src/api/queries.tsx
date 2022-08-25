import { getIdToken } from "../firebase";
import z from "zod";

export async function getPlaylists() {
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

export async function getPlaylistDetails(playlistId: string) {
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

export async function getTracks(playlistId: string) {
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
