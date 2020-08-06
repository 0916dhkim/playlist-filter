import { Action } from "../action";

type Reducer<S, A extends Action> = (state: S, action: A) => S;

/**
 * Create a composed reducer from individual property reducers.
 * If reducer is not provided for a property, the property is not modified.
 * @param reducers Reducers for each state property
 */
export function composeReducers<S>(reducers: {
  [key in keyof S]?: Reducer<S[key], Action>
}): Reducer<S, Action> {
  return (state, action) => {
    const ret = {...state};
    for (const k in reducers) {
      const reducer = reducers[k];
      if (reducer) {
        ret[k] = reducer(state[k], action);
      }
    }
    return ret;
  }
}
