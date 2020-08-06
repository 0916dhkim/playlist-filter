import { LandingPageState, ApplicationState, DEFAULT_AUDIO_FEATURE_RANGE } from "../../state";
import { Action } from "../../action";

function landingPageReducer(state: LandingPageState, action: Action): ApplicationState {
  switch (action.type) {
    case "SIGN_IN":
      return {
        page: "personal",
        playlists: [],
        loadingTracks: false,
        tracks: [],
        audioFeatureRange: DEFAULT_AUDIO_FEATURE_RANGE,
        ...action.value
      }
    default:
      return state;
  }
}

export default landingPageReducer;
