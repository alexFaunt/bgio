/* eslint-disable no-process-env */

const config = {
  VERSION: `${process.env.REACT_APP_VERSION}`,
  SERVER_URL: `${process.env.REACT_APP_SERVER_URL}`,
  GRAPHQL_URL: `${process.env.REACT_APP_GRAPHQL_URL}`,
};

export default config;
