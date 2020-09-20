import { JoinGameResolver } from 'server/graphql/definitions';

// TODO - can you config it so these get generated with less shit names? could always export at the bottom if needed
// ALSO TODO - context type is any currently need to generate one + supply as default
const joinGame: JoinGameResolver = async (root, args, context) => {
  const { userId, gameId, playerId } = args.input;

  // Check it's a real user / auth (lol)

  const { playerCredentials } = await context.bgioProxy.joinGame({ gameId, userId, playerId });

  // Patch gameId into player_games ? or just use some sql magic to retrieve games via setupData?

  return { playerCredentials };
};

export default () => ({
  Mutation: {
    joinGame,
  },
  // CreateGameResponse: {
  //   game: User,
  // },
});
