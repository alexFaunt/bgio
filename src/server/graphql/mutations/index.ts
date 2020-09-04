import { loadFiles } from '@graphql-tools/load-files';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);

const getMutationDefinitions = async (autoResolvers) => {
  const [firstMutation, ...mutations] = await loadFiles('./src/server/graphql/mutations/**/schema.gql');

  const dir = await readdir(__dirname);

  const resolvers = dir.filter((fileName) => fileName !== 'index.ts').reduce((acc, fileName) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    const { Mutation, ...rest } = require(`./${fileName}/mutation.ts`).default(autoResolvers);
    acc.Mutation = Object.assign(acc.Mutation, Mutation);
    return Object.assign(acc, rest);
  }, { Mutation: {} });

  return {
    typeDefs: [
      firstMutation.replace('extend type Mutation', 'type Mutation'),
      ...mutations,
    ],
    resolvers,
  };
};

export default getMutationDefinitions;
