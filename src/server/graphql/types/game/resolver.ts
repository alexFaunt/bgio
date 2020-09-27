const players = (game) => Object.values(game.players).map((player) => {
  const requesterCanReadCreds = true;

  const userId = player.name;
  // console.log('ONE', index, userId, game.players);
console.log('USER ID ', player);
  return {
    id: player.id,
    open: !userId,
    credentials: requesterCanReadCreds ? player.credentials : null,
    user: userId ? { id: userId } : null,
  };
});

const gameResolver = {
  players,
  // result: () => {
  //   return game?.state?.ctx?.gameover.outcome;
  // },
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
};

export default gameResolver;
