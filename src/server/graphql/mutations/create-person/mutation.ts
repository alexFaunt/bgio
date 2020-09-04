import { MutationResolvers } from 'server/graphql/definitions';

// TODO - can you config it so these get generated with less shit names? could always export at the bottom if needed
// ALSO TODO - context type is any currently need to generate one + supply as default
const createPerson: MutationResolvers['createPerson'] = (root, inputPerson) => {
  console.log('HELLOw', inputPerson, root);
  const { name } = inputPerson.input;
  return {
    user: {
      id: 'i',
    },
  };
};

export default ({ User }) => ({
  Mutation: {
    createPerson,
  },
  CreatePersonResponse: {
    user: User,
  },
});
