import { createStore } from "redux";
import { Dispatch } from "react";

export type Playlist = {
  id: string,
  name: string
};

export type Artist = {
  id: string,
  name: string
};

export type Track = {
  id: string,
  name: string,
  artists: ReadonlyArray<Artist>,
  duration_ms: number,
  acousticness: number,
  danceability: number,
  energy: number,
  instrumentalness: number,
  key: number,
  liveness: number,
  loudness: number,
  mode: number,
  speechiness: number,
  tempo: number,
  time_signature: number,
  valence: number
}

export type SignedOutState = {
  signedIn: false
};

export type SignedInState = {
  signedIn: true
  accessToken: string,
  accessTokenExpiry: number,
  refreshToken: string,
  playlists: ReadonlyArray<Playlist>,
  tracks: ReadonlyArray<Track>,
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
  value: ReadonlyArray<Track>
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
