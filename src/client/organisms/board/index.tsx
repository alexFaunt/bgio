import React from 'react';

type Props = {
  // eslint-disable-next-line
  ctx: any, // TODO
};

const Board = ({ ctx }: Props) => {
  if (ctx.gameover) {
    return <h1>Game over</h1>;
  }

  return <h1>Board</h1>;
};

export default Board;
