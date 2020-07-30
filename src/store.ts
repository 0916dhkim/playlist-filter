import { createStore } from "redux";
import { Dispatch } from "react";
import {
  Playlist,
  FullTrack,
  AudioFeatures
} from "./spotify_types";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TrackInfo = Omit<FullTrack, "type"> & Omit<AudioFeatures, "type">;

export type SignedOutState = {
  signedIn: false
};

export type SignedInState = {
  signedIn: true
  accessToken: string,
  accessTokenExpiry: number,
  refreshToken: string,
  playlists: ReadonlyArray<Playlist>,
  tracks: ReadonlyArray<TrackInfo>,
  tempoRange: [number, number]
};

export type ApplicationState = SignedInState | SignedOutState;

type Action = {
  type: "SIGN_IN",
  value: {
    accessToken: string,
    accessTokenExpiry: number,
    refreshToken: string
  }
}
| {
  type: "SIGN_OUT"
}
| {
  type: "SET_PLAYLISTS",
  value: ReadonlyArray<Playlist>
}
| {
  type: "SET_TRACKS",
  value: ReadonlyArray<TrackInfo>
}
| {
  type: "SET_MIN_TEMPO",
  value: number
}
| {
  type: "SET_MAX_TEMPO",
  value: number
};

const INITIAL_STATE: ApplicationState = {
  signedIn: false
};

function signedInReducer(state: SignedInState, action: Action): ApplicationState {
  switch (action.type) {
    case "SIGN_OUT":
      return { signedIn: false };
    case "SET_PLAYLISTS":
      return {
        ...state,
        playlists: action.value
      };
    case "SET_TRACKS":
      return {
        ...state,
        tracks: action.value
      };
    case "SET_MIN_TEMPO":
      return {
        ...state,
        tempoRange: [action.value, state.tempoRange[1]]
      };
    case "SET_MAX_TEMPO":
      return {
        ...state,
        tempoRange: [state.tempoRange[0], action.value]
      };
    default:
      return state;
  }
}

function signedOutReducer(state: SignedOutState, action: Action): ApplicationState {
  switch (action.type) {
    case "SIGN_IN":
      return {
        signedIn: true,
        playlists: [],
        tracks: [],
        tempoRange: [0, 300],
        ...action.value
      }
    default:
      return state;
  }
}

function reducer(state: ApplicationState = INITIAL_STATE, action: Action): ApplicationState {
  if (state.signedIn) {
    return signedInReducer(state, action);
  }
  return signedOutReducer(state, action);
}

export const store = createStore(reducer);
export type ApplicationDispatch = Dispatch<Action>;
