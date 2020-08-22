import { PlayerView } from 'boardgame.io/core';

export default {
  name: 'bgio-poker',
  minPlayers: 2,
  maxPlayers: 2,

  disableUndo: true,
  playerView: PlayerView.STRIP_SECRETS,

  setup: () => ({
    cells: Array(9).fill(null),
  }),

  turn: {
    moveLimit: 1,
  },

  moves: {
    clickCell: (G, ctx, id) => {
      G.cells[id] = ctx.currentPlayer;
    },
  },

  // eslint-disable-next-line consistent-return
  endIf: (G, ctx) => {
    if (G.cells.filter((a) => a).length > 1) {
      return { winner: ctx.currentPlayer };
    }
  },
};
