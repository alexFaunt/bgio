import React from 'react';

type Props = {
  ctx: { gameover: boolean }; // TODO board game type
};

const Board = ({ ctx }: Props) => {
  if (ctx.gameover) {
    return <h1>Game over</h1>;
  }

  return <h1>Board</h1>;
};

export default Board;
