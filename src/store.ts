import { createStore } from "redux";
import { Dispatch } from "react";

type Playlist = {
  id: string,
  name: string
};

export type ApplicationState = {
  credentials?: {
    accessToken: string,
    refreshToken: string
  },
  refreshingToken: boolean,
  playlists: ReadonlyArray<Playlist>
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
};

const INITIAL_STATE: ApplicationState = {
  refreshingToken: false,
  playlists: []
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
    default:
      return state;
  }
}

export const store = createStore(reducer);
export type ApplicationDispatch = Dispatch<Action>;
