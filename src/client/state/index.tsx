import React, { createContext as createReactContext, useContext, useReducer, Dispatch, ReactNode } from 'react';
import { createContext as createSelectableContext, useContextSelector } from 'use-context-selector';

import { AuthState, authReducer, initialAuthState } from 'client/state/reducers/auth';

import { AllActions } from 'actions';

type State = {
  auth: AuthState,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const devTools: any = (global as any)?.__REDUX_DEVTOOLS_EXTENSION__?.connect();
if (devTools) {
  devTools.init();
}

const combinedReducer = ({ auth }: State, action: AllActions) => {
  const newState = {
    auth: authReducer(auth, action),
  };

  if (devTools) {
    devTools.send({ ...action }, newState);
  }

  return newState;
};

const initialState = {
  auth: initialAuthState,
};

export const StateContext = createSelectableContext(initialState);
type Selector<T> = (state: State) => T;
export function useAppState<T>(selector: Selector<T>): T {
  return useContextSelector(StateContext, selector);
}

const initialDispatch: Dispatch<AllActions> = () => null;
export const DispatchContext = createReactContext(initialDispatch);
export const useDispatch = () => useContext(DispatchContext);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(combinedReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        { children }
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
