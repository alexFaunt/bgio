/* eslint-disable no-console */
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';
import * as addPlugin from '@graphql-codegen/add';
import chokidar from 'chokidar';
import debounce from 'lodash/debounce';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

const autoGenWarning = '// THIS IS A GENERATED FILE, DO NOT MODIFY';
const disableLinting = `
/* eslint-disable */
/* tslint:disable */
`;

const invalidateRequireCache = () => {
  Object.keys(require.cache).forEach((key) => {
    if (!key.includes('node_modules')) {
      delete require.cache[key];
    }
  });
};

// TODO if we needed to speed this up, could cache the model defs
const generateTypes = async () => {
  invalidateRequireCache();
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const getSchema = require('server/graphql/schema').default;

  const modelsList = await readdir(path.resolve(__dirname, '../src/server/db/models'));

  const modelDefs = modelsList
    .filter((model) => model !== 'base.ts')
    .map((model) => {
      const filename = model.substring(0, model.length - 3);
      const sentenceCase = `${filename.charAt(0).toUpperCase()}${filename.substring(1)}`;
      return {
        model: filename,
        sentenceCase,
        name: `${sentenceCase}Model`,
      };
    });

  // TODO update import path based on output
  const importModels = modelDefs.map(({ model, name }) => (
    `import ${name} from '../../db/models/${model}';`
  ));

  const prefixLines = [
    autoGenWarning,
    disableLinting,
    ...importModels,
  ].join('\n');

  const mappers = modelDefs.reduce((acc, { name, sentenceCase }) => {
    acc[sentenceCase] = name;
    return acc;
  }, {} as { [key: string]: string });

  const types = await codegen({
    filename: '../src/server/graphql/types/codegen.ts', // Don't think this is used but it's required.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: await getSchema() as any, // DNO why this works...
    documents: [],
    plugins: [
      {
        add: {
          placement: 'prepend',
          content: prefixLines,
        },
      },
      { typescript: {} },
      { typescriptResolvers: {} },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptResolvers: typescriptResolversPlugin,
      add: addPlugin,
    },
    skipDocumentsValidation: true,
    config: {
      namingConvention: {
        enumValues: 'keep',
      },
      useIndexSignature: true,
      contextType: './context#GraphQLContext',
      mappers,
      showUnusedMappers: false,
    },
  });

  const output = path.resolve(__dirname, '../src/server/graphql/types/codegen.ts');

  await writeFile(output, types);

  console.log('Generated GraphQL types');
};

const debouncedGenerateTypes = debounce(async () => {
  try {
    await generateTypes();
  } catch (error) {
    console.log('Failed to generate GraphQL types', error);
  }
}, 100);

const run = async () => {
  // eslint-disable-next-line no-process-env
  if (!process.env.WATCH) {
    await generateTypes();
    return;
  }

  console.log('Watching for GraphQL type changes');

  chokidar.watch([
    './src/server/graphql/mutations',
    './src/server/graphql/schema',
    './src/server/db/models',
  ])
    .on('add', debouncedGenerateTypes)
    .on('addDir', debouncedGenerateTypes)
    .on('change', debouncedGenerateTypes)
    .on('unlink', debouncedGenerateTypes)
    .on('unlinkDir', debouncedGenerateTypes);
};

run();
