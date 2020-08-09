import { PersonalPageState, ApplicationState } from "../../state";
import { Action } from "../../action";
import { composeReducers } from "../composeReducers";
import { playlistReducer } from "./playlistsReducer";
import { selectedPlaylistIdReducer } from "./selectedPlaylistIdReducer";
import { loadingTracksReducer } from "./loadingTracksReducer";
import { tracksReducer } from "./tracksReducer";
import { audioFeatureRangeReducer } from "./audioFeatureRangeReducer";

const composedReducer = composeReducers<PersonalPageState>({
  playlists: playlistReducer,
  selectedPlaylistId: selectedPlaylistIdReducer,
  loadingTracks: loadingTracksReducer,
  tracks: tracksReducer,
  audioFeatureRange: audioFeatureRangeReducer
});

function personalPageReducer(state: PersonalPageState, action: Action): ApplicationState {
  switch (action.type) {
    case "SIGN_OUT":
      return { page: "landing" };
    case "GO_TO_EXPORT_PAGE":
      return {
        page: "export",
        tracks: action.tracks,
        session: state.session,
        newPlaylistName: ""
      };
    default:
      return composedReducer(state, action);
  }
}

export default personalPageReducer;
