import { Server } from 'boardgame.io/server';

import { PostgresStore } from 'bgio-postgres';
import parse from 'sequelize-parse-url';
import SevenHandPoker from 'common/game';

type CreateBoardGameServerArgs = {
  connection: string;
};

const createBoardGameServer = ({ connection }: CreateBoardGameServerArgs) => {
  const config = {
    ...parse(connection),
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
  console.log('CONFIG', config);

  const db = new PostgresStore(config);

  console.log('After DB create');

  const server = Server({
    games: [SevenHandPoker],
    db,

    // Seems to only be to do with the lobby and only for leaving the lobby? soemthing like that
    // ABSOLUTE GARBAGE, can just change your player ID credentials do nothing.
    // Need to write my own transport or something to intercept bad requests
    // generateCredentials: async (ctx) => {
    //   // TODO this doesn't get called?! why?!
    //   console.log('generateCredentials', ctx.state);
    //   return 'one two three';
    // },
    // authenticateCredentials: (credentials, playerMetadata, ...args) => {
    //   const { id: playerId, name: userId, credentials: requiredCredentials } = playerMetadata;
    //   // Can use userId to check if it's legit (called on actions but not on reading...)
    //   console.log('WHAT THE FUCK', playerId, userId, credentials, requiredCredentials, args);
    //   return credentials === requiredCredentials;
    // },
  });

  return server;
};

export default createBoardGameServer;
