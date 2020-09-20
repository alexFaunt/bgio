import { CreateGameResolver } from 'server/graphql/definitions';

// TODO - can you config it so these get generated with less shit names? could always export at the bottom if needed
// ALSO TODO - context type is any currently need to generate one + supply as default
const createGame: CreateGameResolver = async (root, args, context) => {
  const { creatingUserId } = args.input;

  // Check it's a real user / auth (lol)

  const { gameID: gameId } = await context.bgioProxy.createGame({ creatingUserId });

  const { playerCredentials } = await context.bgioProxy.joinGame({ gameId, userId: creatingUserId, playerId: 0 });

  // Patch gameId into player_games ? or just use some sql magic to retrieve games via setupData?

  return { gameId, playerId: '0', playerCredentials };
};

export default () => ({
  Mutation: {
    createGame,
  },
  // CreateGameResponse: {
  //   game: User,
  // },
});
