import { createStore } from "redux";
import { Dispatch } from "react";

export type ApplicationState = {
  credentials?: {
    accessToken: string,
    refreshToken: string
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
};

function reducer(state: ApplicationState = {}, action: Action): ApplicationState {
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
    default:
      return state;
  }
}

export const store = createStore(reducer);
export type ApplicationDispatch = Dispatch<Action>;
