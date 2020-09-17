import { createReducer } from 'client/state/reducers';
import { AuthActionTypes, Login, Logout } from 'client/state/actions/auth';
import { ActionCreator, Handler } from 'client/state/actions';

export type AuthState = {
  userId: string | null;
};

type AuthHandler<Action extends ActionCreator> = Handler<AuthState, Action>;

const emptyState: AuthState = {
  userId: null,
};

const USER_ID_LS_KEY = 'seven_hand_user_id_key';

const setState = ({ userId }: AuthState) => {
  if (userId) {
    global.localStorage.setItem(USER_ID_LS_KEY, userId);
  }
};

const clearState: () => void = () => {
  global.localStorage.removeItem(USER_ID_LS_KEY);
};

export const getPersistedState = (): AuthState => ({
  userId: global.localStorage.getItem(USER_ID_LS_KEY),
});

const loginHandler: Handler<Login> = (state, payload): AuthState => {
  const { userId } = payload;
  const newState = {
    userId,
  };
  setState(newState);
  return newState;
};

const logoutHandler: Handler<Logout> = (): AuthState => {
  clearState();
  return emptyState;
};

const handlers = {
  [AuthActionTypes.LOGIN]: loginHandler,
  [AuthActionTypes.LOGOUT]: logoutHandler,
};

const persistedState = getPersistedState();

export const initialAuthState = persistedState;

export const authReducer = createReducer<AuthState>(handlers);
