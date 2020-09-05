import getConfig from 'server/config';
import createServer from 'server/server';
// import fetch from 'node-fetch';
// import PetModel from 'server/db/models/pet';

const uncaughtError = (error: Error) => {
  console.error('[fatal]', error);

  // Kill the server, but not immediately so we can have the chance of reporting the error
  setTimeout(() => {
    process.exit(-1);
  }, 2500);
};

process.on('uncaughtException', uncaughtError);
process.on('unhandledRejection', uncaughtError);

const runServer = async () => {
  try {
    const config = getConfig();
    const server = await createServer(config);

    // Run the server
    server.run(
      config.SERVER_PORT,
      async () => {
        // TODO logger.
        console.log(`Doing server things ${config.SERVER_PORT}`);
        // console.log('PET2', await PetModel.query().insert({ name: 'jennifer', longField: 'Lawrence' }))

        // const a = await fetch('http://0.0.0.0:2001/games/seven-hand-poker/create', {
        //   method: 'POST',
        // });
        // const b = await a.text();
        // console.log('A ---- ', b);
      },
    );
  } catch (error) {
    uncaughtError(error);
  }
};

runServer();
