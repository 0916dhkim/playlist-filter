import { createReducer } from "../createReducer";

export const selectedPlaylistIdReducer = createReducer<string | undefined>({
  START_FETCHING_TRACKS: (_, action) => action.playlistId
});
