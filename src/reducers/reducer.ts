import { ApplicationState, INITIAL_STATE } from "../state";
import { Action } from "../action";
import landingPageReducer from "./LandingPage/landingPageReducer";
import personalPageReducer from "./PersonalPage/personalPageReducer";

export function reducer(state: ApplicationState | undefined, action: Action): ApplicationState {
  if (!state) {
    return INITIAL_STATE;
  }
  switch(state.page) {
    case "landing":
      return landingPageReducer(state, action);
    case "personal":
      return personalPageReducer(state, action);
  }
}
