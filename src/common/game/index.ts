// import { PlayerView } from 'boardgame.io/core';

// export default {
//   name: 'bgio-poker',

//   setup: () => ({
//     coins: Array(7).fill(null),
//   }),

//   moves: {
//     doThing: () => null,
//   },

//   endIf: () => {},

//   onEnd: () => console.log('Game over!'),

//   playerView: PlayerView.STRIP_SECRETS,
//   minPlayers: 2,
//   maxPlayers: 2,

//   disableUndo: true,
// };

export default {
  setup: () => ({ cells: Array(9).fill(null) }),

  turn: {
    moveLimit: 1,
  },

  moves: {
    clickCell: (G, ctx, id) => {
      console.log(id);
      G.cells[id] = ctx.currentPlayer;
    },
  },

  endIf: (G, ctx) => {
    console.log(G.cells);
    if (G.cells.filter((a) => a).length > 1) {
      return { winner: ctx.currentPlayer };
    }
  },
};
