import { AutoResolvers, CreatePersonResolver } from 'server/graphql/definitions';

// TODO - can you config it so these get generated with less shit names? could always export at the bottom if needed
// ALSO TODO - context type is any currently need to generate one + supply as default
const createPerson: CreatePersonResolver = async (root, inputPerson) => {
  const { name } = inputPerson.input;

  return {
    user: {
      id: 'i',
      name,
    },
  };
};

export default ({ User }: AutoResolvers) => ({
  Mutation: {
    createPerson,
  },
  CreatePersonResponse: {
    user: User,
  },
});
