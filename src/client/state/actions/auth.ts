export enum AuthActionTypes {
  LOGIN = 'AUTH/LOGIN',
  LOGOUT = 'AUTH/LOGOUT',
}

type LoginPayload = {
  userId: string,
  userSecret: string,
};

export const login = (payload: LoginPayload) => ({
  type: AuthActionTypes.LOGIN,
  payload,
});

export type Login = typeof login;

export const logout = () => ({
  type: AuthActionTypes.LOGOUT,
});

export type Logout = typeof logout;
