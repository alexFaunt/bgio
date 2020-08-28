import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';

import TicTacToe from 'common/game';
import Board from 'client/organisms/board';
import config from 'client/config';

const Game = Client({
  game: TicTacToe,
  board: Board,
  multiplayer: SocketIO({
    server: config.SERVER_URL,
    socketOpts: {
      transports: ['websocket'],
    },
  }),
});

render((
  <StrictMode>
    <Game playerID={window.location.search.split('').pop()} />
  </StrictMode>
), document.getElementById('root'));
