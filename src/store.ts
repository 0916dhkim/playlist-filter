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

export type ApplicationState = {
  credentials?: {
    accessToken: string,
    refreshToken: string
  },
  refreshingToken: boolean,
  playlists: ReadonlyArray<Playlist>,
  tracks: ReadonlyArray<Track>,
  tempoRange: {
    min: number,
    max: number
  }
};

type Action = {
  type: "GET_CREDENTIALS",
  value: {
    accessToken: string,
    refreshToken: string
  }
}
| {
  type: "SIGN_OUT"
}
| {
  type: "BEGIN_TOKEN_REFRESH"
}
| {
  type: "END_TOKEN_REFRESH"
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
  refreshingToken: false,
  playlists: [],
  tracks: [],
  tempoRange: { min: 0, max: 300 }
};

function reducer(state: ApplicationState = INITIAL_STATE, action: Action): ApplicationState {
  switch (action.type) {
    case "GET_CREDENTIALS":
      return {
        ...state,
        credentials: action.value
      };
    case "SIGN_OUT":
      return {
        ...state,
        credentials: undefined
      };
    case "BEGIN_TOKEN_REFRESH":
      return {
        ...state,
        refreshingToken: true
      };
    case "END_TOKEN_REFRESH":
      return {
        ...state,
        refreshingToken: false
      };
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
        tempoRange: {
          ...state.tempoRange,
          min: action.value
        }
      };
    case "SET_MAX_TEMPO":
      return {
        ...state,
        tempoRange: {
          ...state.tempoRange,
          max: action.value
        }
      };
    default:
      return state;
  }
}

export const store = createStore(reducer);
export type ApplicationDispatch = Dispatch<Action>;
