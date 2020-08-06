import { createReducer } from "../createReducer";
import { AudioFeatureRange, DEFAULT_AUDIO_FEATURE_RANGE } from "../../state";

export const audioFeatureRangeReducer = createReducer<AudioFeatureRange>({
  SET_AUDIO_FEATURE_MIN: (state, action) => ({
    ...state,
    [action.feature]: [
      action.value,
      state[action.feature][1]
    ]
  }),
  SET_AUDIO_FEATURE_MAX: (state, action) => ({
    ...state,
    [action.feature]: [
      state[action.feature][0],
      action.value
    ]
  }),
  RESET_AUDIO_FEATURE_RANGE: () => DEFAULT_AUDIO_FEATURE_RANGE
});