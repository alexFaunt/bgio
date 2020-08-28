import { MutationResolvers } from 'server/graphql/types';

// TODO - can you config it so these get generated with less shit names? could always export at the bottom if needed
// ALSO TODO - context type is any currently need to generate one + supply as default
const createPerson: MutationResolvers['createPerson'] = (root, inputPerson) => {
  const { name } = inputPerson.input;

  return {
    user: {
      name,
    },
  };
};

export default createPerson;
