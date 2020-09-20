import fetch from 'node-fetch';

// TODO - this is lame but cba how to work out how to get CreateGame from the src and have it compile / fork/copy ir
const createProxy = (url: string) => async ({ path, body }) => {
  // TODO fix url
  const joinGameRes = await fetch(`${url}/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  const res = await joinGameRes.json();
  return res;
};

const createBgioProxy = (url: string) => {
  const proxy = createProxy(url);

  return ({
    createGame: ({ creatingUserId }) => proxy({
      path: 'games/seven-hand-poker/create',
      body: {
        unlisted: true,
        setupData: {
          creatingUserId,
        },
      },
    }),
    joinGame: ({ gameId, userId, playerId }) => proxy({
      path: `games/seven-hand-poker/${gameId}/join`,
      body: {
        playerID: playerId,
        playerName: userId,
      },
    }),
  });
};

export default createBgioProxy;
