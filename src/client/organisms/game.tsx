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
    // Locally i set to IP:2001 in production we just undefined and default takes over
    // Would be nice to be the same but :shrug:
    server: config.SERVER_URL || undefined,
    socketOpts: {
      transports: ['websocket'],
    },
  }),
});

export default ({ gameId, credentials, playerId }) => (
  <Game
    gameID={gameId}
    credentials={credentials}
    playerID={playerId}
    debug={config.BGIO_DEBUG}
  />
);
