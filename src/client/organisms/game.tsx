import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';

import SevenHandPoker from 'common/game';
import Board from 'client/organisms/board';
import config from 'client/config';

const Game = Client({
  game: SevenHandPoker,
  board: Board,
  multiplayer: SocketIO({
    server: config.SERVER_URL,
    socketOpts: {
      transports: ['websocket'],
    },
  }),
});

export default ({ gameId, credentials, playerId }) => {
  console.log('RENDER GAME', gameId, credentials, playerId);

  return (
    <div>
      <div>{ JSON.stringify({ gameId, credentials, playerId }) }</div>
      <Game gameID={gameId} credentials={credentials} playerID={playerId} debug={config.BGIO_DEBUG} />
    </div>
  );
};
