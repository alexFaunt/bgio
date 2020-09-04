import { mergeSchemas } from '@graphql-tools/merge';

import createMutationDefinitions from 'server/graphql/mutations';
import createAutomaticSchema from 'server/graphql/schema/auto';

const createSchema = async () => {
  const { schema: autoSchema, resolvers: autoResolvers } = await createAutomaticSchema();

  const { resolvers: mutationResolvers, typeDefs: mutationTypeDefs } = await createMutationDefinitions(autoResolvers);
  // console.log('MUTATIONS', Mutation.createPerson({}, { input: { name: 'hi' } }));

  // TODO - load these from types + the resolveField etc. (don't forget to add to the babel-watch command)
  // Can merge schemas with custom types + resolvers
  const customType = 'type User { resolvedField: String! }';

  const schema = mergeSchemas({
    schemas: [autoSchema],
    resolvers: {
      ...mutationResolvers,
      // TODO custom fields
      User: {
        resolvedField: () => 'hi',
      },
    },
    typeDefs: [
      ...mutationTypeDefs,
      customType,
    ],
  });

  return schema;
};

export default createSchema;
