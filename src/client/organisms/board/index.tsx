import React, { useEffect } from 'react';

import config from 'client/config';
console.log('CONFIG', config);
const Board = ({ ctx }) => {
  if (ctx.gameover) {
    return <h1>Game over</h1>;
  }

  return <h1>Board</h1>;
};

export default Board;
