import { Action } from "../action";

type Reducer<S, A extends Action> = (state: S, action: A) => S;
type ActionType = Action["type"];
type ReducerObject<S> = {
  [key in ActionType]?: Reducer<S, Extract<Action, {type: key}>>
};

/**
 * Helper function for creating a new reducer from
 * object of action handlers.
 * @param handlers A javascript object with action type as keys and handler function as value.
 */
export function createReducer<S>(handlers: ReducerObject<S>): Reducer<S, Action> {
  return (state: S, action: Action) => {
    if (handlers.hasOwnProperty(action.type)) {
      const handler = handlers[action.type] as Reducer<S, Action>;
      return handler(state, action);
    }
    return state;
  };
}
