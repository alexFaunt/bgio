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
  });

  return server;
};

export default createBoardGameServer;
