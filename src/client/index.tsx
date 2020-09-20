import React, { StrictMode } from 'react';
import { render } from 'react-dom';

import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Switch } from 'react-router-dom';

import config from 'client/config';
import { StateProvider } from 'client/state';
import { ProtectedRoute, LoginRoute } from 'client/utils/auth-routes';
import createApolloClient from 'client/apollo-client';

import Games from 'client/pages/games';
import Home from 'client/pages/home';
import Game from 'client/pages/game';

const apolloClient = createApolloClient({
  uri: config.GRAPHQL_URL,
  debug: true,
  version: 'dev',
});

render((
  <StrictMode>
    <BrowserRouter>
      {/* <ThemeProvider> */}
      {/* <ErrorBoundary> */}
      {/* <GlobalStyles /> */}
      <StateProvider>
        <ApolloProvider client={apolloClient}>
          <Switch>
            <LoginRoute path="/" exact component={Home} />
            <ProtectedRoute path="/games" exact component={Games} />
            <ProtectedRoute path="/game/:id" exact component={Game} />
            {/* Route - 404 */}
          </Switch>
        </ApolloProvider>
      </StateProvider>
      {/* </ErrorBoundary> */}
      {/* </ThemeProvider> */}
    </BrowserRouter>
  </StrictMode>
), document.getElementById('root'));
