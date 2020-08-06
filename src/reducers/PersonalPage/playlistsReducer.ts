import { Playlist } from "../../spotify_types";
import { createReducer } from "../createReducer";

export const playlistReducer = createReducer<ReadonlyArray<Playlist>>({
  SET_PLAYLISTS: (_, action) => action.value
});
