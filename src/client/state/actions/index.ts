interface IAction {
  type: string;
  payload?: unknown;
}
export type ActionCreator = (...args: unknown[]) => IAction;
export type Payload<Action extends ActionCreator> = ReturnType<Action>['payload'];
export type Handler<State, Action extends ActionCreator> = (state: State, payload: Payload<Action>) => State;
