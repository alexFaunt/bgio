/* eslint-disable consistent-return */
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { getUserSecret } from 'client/state/reducers/auth';

type GetClientArgs = {
  uri: string;
  debug: boolean;
  version: string;
};

export default ({ uri, debug, version }) => {
  const getContext = async ({ headers = {}, ...context }) => {
    const userSecret = getUserSecret();
    const secretHeader = userSecret ? { 'x-shp-user-secret': userSecret } : {};
    return {
      ...context,
      headers: {
        ...headers,
        ...secretHeader,
      },
    };
  };

  // Create the link to fetch from the api
  const apiLink = new HttpLink({
    uri,
    headers: {},
    credentials: 'include',
  });

  // Create an auth link which reads from persisted auth state
  const authLink = setContext((_, context) => getContext(context));

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    connectToDevTools: debug,
    link: authLink.concat(apiLink),
    name: 'bgio-seven-hand-poker',
    version,
  });

  return client;
};
