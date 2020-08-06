import { createStore } from "redux";
import { Dispatch } from "react";
import { Action } from "./action";
import { reducer } from "./reducers/reducer";

export const store = createStore(reducer);
export type ApplicationDispatch = Dispatch<Action>;
