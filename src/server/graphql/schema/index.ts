import { mergeSchemas } from '@graphql-tools/merge';
import { GraphQLDateTime } from 'graphql-iso-date';

import createAutomaticSchema from 'server/graphql/schema/auto';
import createMutationDefinitions from 'server/graphql/mutations';
import createCustomTypeDefs from 'server/graphql/types';

const createSchema = async () => {
  const { schema: autoSchema, resolvers: autoResolvers } = await createAutomaticSchema();

  const { resolvers: mutationResolvers, typeDefs: mutationTypeDefs } = await createMutationDefinitions(autoResolvers);
  const { resolvers: customResolvers, typeDefs: customTypeDefs } = await createCustomTypeDefs(autoResolvers);

  // TODO prevent clashes

  const schema = mergeSchemas({
    schemas: [
      autoSchema,
    ],
    resolvers: {
      DateTime: GraphQLDateTime,
      ...mutationResolvers,
      ...customResolvers,
    },
    typeDefs: [
      'scalar DateTime',
      ...mutationTypeDefs,
      ...customTypeDefs,
    ],
  });

  return schema;
};

export default createSchema;
