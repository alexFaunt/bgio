import { AutoResolvers } from 'server/graphql/definitions';

// TODO resolver types
export default ({ User }: AutoResolvers) => ({
  user: async (player, args, context, info) => (
    player.user && User({}, { id: player.user.id }, context, info)
  ),
  // Obfuscate credentials if you are not this person
  credentials: (player, args, context) => {
    if (!player.user) {
      // No user has taken seat, it's open if you want it
      return player.credentials;
    }

    return (
      context.auth.user?.id === player.user.id ? player.credentials : null
    );
  },
});
