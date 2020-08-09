import { createReducer } from "../createReducer";

export const newPlaylistNameReducer = createReducer<string>({
  SET_NEW_PLAYLIST_NAME: (_, action) => action.value
});
