/* eslint-disable no-process-env */

const opt = (input: string): string | null => (
  input === 'undefined' ? null : input
);

const config = {
  VERSION: `${process.env.REACT_APP_VERSION}`,
  SERVER_URL: opt(`${process.env.REACT_APP_SERVER_URL}`),
  GRAPHQL_URL: `${process.env.REACT_APP_GRAPHQL_URL}`,
  BGIO_DEBUG: process.env.REACT_APP_BGIO_DEBUG === 'true',
};

export default config;
