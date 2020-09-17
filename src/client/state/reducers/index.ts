// TODO help type this!?
export function createReducer<State>(
  handlers: unknown,
) {
  return (state: State, action: unknown) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action.payload) : state;
  };
}
