import { ExportPageState, ApplicationState } from "../../state";
import { Action } from "../../action";
import { composeReducers } from "../composeReducers";
import { newPlaylistNameReducer } from "./newPlaylistNameReducer";

const composedReducer = composeReducers<ExportPageState>({
  newPlaylistName: newPlaylistNameReducer
});

export function exportPageReducer(state: ExportPageState, action: Action): ApplicationState {
  return composedReducer(state, action);
}
