import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';

import SevenHandPoker from 'common/game';
import Board from 'client/organisms/board';
import config from 'client/config';
import { useAppState } from 'client/state';

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

export default (props) => {
  const userId = useAppState(({ auth }) => auth.userId);
  return (
    <div>
      <div>{ userId }</div>
      <div>{ JSON.stringify(props) }</div>
      <Game playerID={userId} />
    </div>
  );
};
