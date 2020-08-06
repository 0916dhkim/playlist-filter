import { createReducer } from "../createReducer";

export const loadingTracksReducer = createReducer<boolean>({
  START_FETCHING_TRACKS: () => true,
  SET_TRACKS: () => false
});
