/* eslint-disable no-console, max-len */
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';
import * as addPlugin from '@graphql-codegen/add';
import chokidar from 'chokidar';
import debounce from 'lodash/debounce';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { camelCase } from 'lodash';

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
  const mutationsList = await readdir(path.resolve(__dirname, '../src/server/graphql/mutations'));

  const modelDefs = modelsList
    .filter((model) => model !== 'index.ts')
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

  // AutoResolvers output
  const autoResolvers = modelDefs
    .map(({ sentenceCase }) => `  ${sentenceCase}: ResolverFn<ResolverTypeWrapper<${sentenceCase}>, unknown, GraphQLContext, { id: string }>,`)
    .join('\n');

  const autoSchema = `export type AutoResolvers = {\n${autoResolvers}\n}`;

  const mutationTypes = mutationsList
    .filter((filename) => filename !== 'index.ts')
    .map((filename) => {
      const camelFilename = camelCase(filename);
      const mutationTypeName = `${camelFilename.charAt(0).toUpperCase()}${camelFilename.substring(1)}`;
      return [
        `type ${mutationTypeName}ResolverResponse = Record<keyof Omit<${mutationTypeName}Response, '__typename'>, { id: string }>;`,
        `export type ${mutationTypeName}Resolver = Resolver<${mutationTypeName}ResolverResponse, unknown, GraphQLContext, RequireFields<Mutation${mutationTypeName}Args, 'input'>>;`,
      ].join('\n');
    })
    .join('\n');

  const types = await codegen({
    filename: '../src/server/graphql/definitions/codegen.ts', // Don't think this is used but it's required.
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
      {
        add: {
          placement: 'append',
          content: autoSchema,
        },
      },
      {
        add: {
          placement: 'append',
          content: mutationTypes,
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

  // Codegen output
  const output = path.resolve(__dirname, '../src/server/graphql/definitions/codegen.ts');
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
