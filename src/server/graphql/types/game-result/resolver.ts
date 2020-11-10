import { AutoResolvers } from 'server/graphql/definitions';

export default ({ User }: AutoResolvers) => ({
  winner: ({ winner }, _, context, info) => winner && User({}, { id: winner.id }, context, info),
  loser: ({ loser }, _, context, info) => loser && User({}, { id: loser.id }, context, info),
});
