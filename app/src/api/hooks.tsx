import { getPlaylistDetails, getPlaylists, getTracks } from "./queries";

import { useQuery } from "@tanstack/react-query";

export function usePlaylistsQuery() {
  return useQuery(["playlists"], () => getPlaylists());
}

export function usePlaylistDetailsQuery(playlistId: string) {
  return useQuery(["playlistDetails", playlistId], () =>
    getPlaylistDetails(playlistId)
  );
}

export function useTracksQuery(playlistId: string) {
  return useQuery(["tracks", playlistId], () => getTracks(playlistId));
}
