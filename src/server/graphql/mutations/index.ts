import { loadFiles } from '@graphql-tools/load-files';
import fs from 'fs';
import { promisify } from 'util';
import { camelCase } from 'lodash';

const readdir = promisify(fs.readdir);

const getMutationDefinitions = async () => {
  const [firstMutation, ...mutations] = await loadFiles('./src/server/graphql/mutations/**/schema.gql');

  const dir = await readdir(__dirname);

  const resolvers = dir.filter((fileName) => fileName !== 'index.ts').reduce((acc, fileName) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    acc[camelCase(fileName)] = require(`./${fileName}/mutation.ts`).default;
    return acc;
  }, {});

  return {
    typeDefs: [
      firstMutation.replace('extend type Mutation', 'type Mutation'),
      ...mutations,
    ],
    resolvers,
  };
};

export default getMutationDefinitions;
