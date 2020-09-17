/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentClass } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useAppState } from 'client/state';

export type Props = {
  component: ((args: unknown) => (JSX.Element) | null) | ComponentClass<unknown>;
  exact?: boolean;
  path?: string;
};

const ProtectedRoute = ({ component: Component, ...rest }: Props) => {
  const loggedIn = useAppState(({ auth }) => auth.userId);

  return (
    <Route
      {...rest}
      render={
        (props) => (
          loggedIn
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/', state: { returnRoute: props.location } }} />
        )
      }
    />
  );
};

const LoginRoute = ({ component: Component, ...rest }: Props) => {
  const loggedIn = useAppState(({ auth }) => auth.userId);
  // TODO returnRoute default to games
  return (
    <Route
      {...rest}
      render={(props) => (loggedIn ? <Redirect to={{ pathname: '/games' }} /> : <Component {...props} />)}
    />
  );
};

export {
  ProtectedRoute,
  LoginRoute,
};
