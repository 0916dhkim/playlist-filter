import { createReducer } from "../createReducer";
import { TrackInfo } from "../../state";

export const tracksReducer = createReducer<ReadonlyArray<TrackInfo>>({
  SET_TRACKS: (_, action) => action.value
});
