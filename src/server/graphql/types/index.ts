import { loadFiles } from '@graphql-tools/load-files';
import fs from 'fs';
import { promisify } from 'util';
import { camelCase } from 'lodash';

const readdir = promisify(fs.readdir);

// TODO if want to extend Query would need more work. But questionable if you would, or use federation

const getMutationDefinitions = async () => {
  const typeDefs = await loadFiles('./src/server/graphql/types/**/schema.gql');

  const dir = await readdir(__dirname);

  const resolvers = dir.filter((fileName) => fileName !== 'index.ts').reduce((acc, fileName) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    const resolver = require(`./${fileName}/resolver.ts`).default;
    const camelCaseFileName = camelCase(fileName);

    acc[`${camelCaseFileName.substring(0, 1).toUpperCase()}${camelCaseFileName.substring(1)}`] = resolver;

    return acc;
  }, {} as { [key: string]: unknown });

  return {
    typeDefs,
    resolvers,
  };
};

export default getMutationDefinitions;
