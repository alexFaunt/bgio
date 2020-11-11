import React, { StrictMode } from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import config from 'client/config';
import { StateProvider } from 'client/state';
import { ProtectedRoute, LoginRoute } from 'client/utils/auth-routes';
import createApolloClient from 'client/apollo-client';

import Games from 'client/pages/games';
import Home from 'client/pages/home';
import Game from 'client/pages/game';
import Profile from 'client/pages/profile';
import ThemeProvider from 'client/styles/theme';
import GlobalStyles from 'client/styles/global';
import useFontLoader from 'client/hooks/use-font-loader';

Modal.setAppElement('#root');

const apolloClient = createApolloClient({
  uri: config.GRAPHQL_URL,
  debug: true,
  version: 'dev',
});

const NotFound = () => (
  <div>
    <h1>Not Found</h1>
    <a href="/games">Get out of here</a>
  </div>
);

const Loader = styled.div`
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 1s ease-out;
`;

const App = () => {
  const fontLoaded = useFontLoader('Poppins');

  return (
    <StrictMode>
      <ThemeProvider>
        <GlobalStyles />
        <Loader show={fontLoaded}>
          <BrowserRouter>
            {/* <ErrorBoundary> */}
            <StateProvider>
              <ApolloProvider client={apolloClient}>
                <Switch>
                  <LoginRoute path="/" exact component={Home} />
                  <ProtectedRoute path="/profile/:id" exact component={Profile} />
                  <ProtectedRoute path="/games" exact component={Games} />
                  <ProtectedRoute path="/game/:id" exact component={Game} />
                  <Route component={NotFound} />
                </Switch>
              </ApolloProvider>
            </StateProvider>
            {/* </ErrorBoundary> */}
          </BrowserRouter>
        </Loader>
      </ThemeProvider>
    </StrictMode>
  );
};

render(<App />, document.getElementById('root'));
