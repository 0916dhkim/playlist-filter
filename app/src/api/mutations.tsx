import { AudioFeatureRanges } from "./types";
import { z } from "zod";

export async function signIn(code: string): Promise<void> {
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign in");
  }

  return;
}

export async function signOut(): Promise<void> {
  const response = await fetch("/api/signout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to sign out");
  }

  return;
}

export async function exportPlaylist(variables: {
  sourcePlaylistId: string;
  playlistName: string;
  audioFeatureRanges: AudioFeatureRanges;
}): Promise<string> {
  const response = await fetch(
    `/api/playlists/${variables.sourcePlaylistId}/export`,
    {
      method: "POST",
      headers: {
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
