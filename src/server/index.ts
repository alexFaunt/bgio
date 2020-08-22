import getConfig from 'server/config';
import createServer from 'server/server';

const uncaughtError = (error: Error) => {
  console.error('[fatal]', error);

  // Kill the server, but not immediately so we can have the chance of reporting the error
  setTimeout(() => {
    process.exit(-1);
  }, 2500);
};

process.on('uncaughtException', uncaughtError);
process.on('unhandledRejection', uncaughtError);

const runServer = () => {
  try {
    const config = getConfig();
    const server = createServer(config);

    // Run the server
    server.run(
      config.SERVER_PORT,
      // TODO logger.
      () => console.log(`Doing server things ${config.SERVER_PORT}`),
    );
  } catch (error) {
    uncaughtError(error);
  }
};

runServer();
