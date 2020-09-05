import { Server } from 'boardgame.io/server';

import { PostgresStore } from 'bgio-postgres';
import SevenHandPoker from 'common/game';
import { Connection } from 'server/db/pool';

type CreateBoardGameServerArgs = {
  connection: Connection;
};

const createBoardGameServer = ({ connection }: CreateBoardGameServerArgs) => {
  const { user: username, ...storeConnection } = connection;
  const db = new PostgresStore({
    username,
    ...storeConnection,
  });

  const server = Server({
    games: [SevenHandPoker],
    db,
    // generateCredentials: (ctx) => {
    //   // TODO this doesn't get called?! why?!
    //   console.log('generateCredentials', ctx.state);
    // },
    // authenticateCredentials: (credentials, playerMetadata) => {
    //   console.log('authenticateCredentials', credentials, playerMetadata);
    // },
  });

  return server;
};

export default createBoardGameServer;
