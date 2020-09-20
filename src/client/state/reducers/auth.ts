import { createReducer } from 'client/state/reducers';
import { AuthActionTypes, Login, Logout } from 'client/state/actions/auth';
import { ActionCreator, Handler } from 'client/state/actions';

export type AuthState = {
  userId: string | null;
  userSecret: string | null;
};

type AuthHandler<Action extends ActionCreator> = Handler<AuthState, Action>;

const emptyState: AuthState = {
  userId: null,
  userSecret: null,
};

const USER_ID_LS_KEY = 'seven_hand_user_id_key';
const USER_SECRET_LS_KEY = 'seven_hand_user_secret_key';

const persistState = ({ userId, userSecret }: AuthState) => {
  localStorage.setItem(USER_ID_LS_KEY, userId);
  localStorage.setItem(USER_SECRET_LS_KEY, userSecret);
};

const clearState: () => void = () => {
  localStorage.removeItem(USER_ID_LS_KEY);
  localStorage.removeItem(USER_SECRET_LS_KEY);
};

const getPersistedState = (): AuthState => {
  const userId = localStorage.getItem(USER_ID_LS_KEY);
  const userSecret = localStorage.getItem(USER_SECRET_LS_KEY);

  if (!userId || !userSecret) {
    clearState();
    return emptyState;
  }

  return { userId, userSecret };
};

export const getUserSecret = () => getPersistedState().userSecret;

const loginHandler: AuthHandler<Login> = (state, payload): AuthState => {
  persistState(payload);
  return payload;
};

const logoutHandler: AuthHandler<Logout> = (): AuthState => {
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
