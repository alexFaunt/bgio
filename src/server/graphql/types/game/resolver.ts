const players = (game) => Object.values(game.players).map((player) => {
  const requesterCanReadCreds = true;

  const userId = player.name;

  return {
    id: player.id,
    open: !userId,
    credentials: requesterCanReadCreds ? player.credentials : null,
    user: userId ? { id: userId } : null,
  };
});

const gameResolver = {
  players,
  // TODO what is gameover
  // result: (game) => game?.state?.ctx?.gameover.outcome,
  turnNumber: (game) => game?.state?.ctx?.turn,
  currentPlayer: (game) => {
    // Game is finished, or not started
    if (game?.state?.ctx?.gameover || !game?.players['1'].name) {
      return null;
    }

    const currentPlayer = game?.state?.ctx?.currentPlayer;

    // Game is in progress - who's go is it
    if (currentPlayer) {
      const userId = game.players[currentPlayer].name;
      return { id: userId };
    }

    return null;
  },
  status: (game) => {
    if (game?.state?.ctx?.gameover) {
      return 'COMPLETE';
    }

    if (!game?.players['1'].name) {
      return 'PENDING';
    }

    if (game?.players['1'].name) {
      return 'PLAYING';
    }

    return 'UNKNOWN';
  },
  result: (game) => {
    const result = game?.state?.ctx?.gameover;

    if (!result) {
      return null;
    }

    const { outcome, endedAt, winningPlayerId } = result;
    const losingPlayerId = winningPlayerId === '0' ? '1' : '0';

    const details = { outcome, endedAt };

    if (outcome === 'DRAW') {
      return details;
    }

    const winnerId = game.players[winningPlayerId].name;
    const loserId = game.players[losingPlayerId].name;

    return {
      ...details,
      winner: { id: winnerId },
      loser: { id: loserId },
    };
  },
};

export default gameResolver;
