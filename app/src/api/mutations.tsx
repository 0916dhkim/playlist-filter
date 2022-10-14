import { getPlaylists, queryKey } from "./queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AudioFeatureRanges } from "./types";
import { getIdToken } from "../firebase";
import { z } from "zod";

async function exportPlaylist(variables: {
  sourcePlaylistId: string;
  playlistName: string;
  audioFeatureRanges: AudioFeatureRanges;
}): Promise<string> {
  const idToken = await getIdToken();
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/playlists/${
      variables.sourcePlaylistId
    }/export`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playlistName: variables.playlistName,
        audioFeatureRanges: variables.audioFeatureRanges,
      }),
    }
  );

  const parsed = z
    .object({
      playlistId: z.string(),
    })
    .parse(await response.json());

  return parsed.playlistId;
}

export function useExportPlaylistMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation(exportPlaylist, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey(getPlaylists()));
    },
  });
  return mutation;
}
