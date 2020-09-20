import { AutoResolvers, CreateUserResolver } from 'server/graphql/definitions';

// TODO - can you config it so these get generated with less shit names? could always export at the bottom if needed
// ALSO TODO - context type is any currently need to generate one + supply as default
const createUser: CreateUserResolver = async (root, inputPerson, context) => {
  const { name } = inputPerson.input;

  // TODO "data sources"
  const user = await context.models.user
    .query()
    .insert({
      name,
    })
    .returning('*');

  console.log('USER', user);

  return user;
};

export default ({ User }: AutoResolvers) => ({
  Mutation: {
    createUser,
  },
  CreateUserResponse: {
    user: (createUserResponse, args, ctx, info) => User({}, { id: createUserResponse.id }, ctx, info),
  },
});
