import { mergeSchemas } from '@graphql-tools/merge';

import { SchemaBuilder } from 'server/graphql/objection/schema-builder';
import models from 'server/db/models';
import createMutationDefinitions from 'server/graphql/mutations';
import createAutomaticSchema from 'server/graphql/schema/auto';



const createSchema = async () => {
  const autoSchema = await createAutomaticSchema();
  // TBH just redo this shit?
  const { resolvers: Mutation, typeDefs: mutationTypeDefs } = await createMutationDefinitions();
  // console.log('AUTO', autoSchema.getQueryType()?.getFields())

  const schema = mergeSchemas({
    schemas: [autoSchema],
    resolvers: {
      // can add custom resolvers here - but not fields, so can only do privacy stuff. Might be able to extend type User
      Mutation,
      CreatePersonResponse: {
        user: async (parent, ...args) => {
          // Hmmm - can't easily resolve this shit back onto the main schema
          // I guess could federate them together somehow... this is all garbag tbh
          return parent.user;
        },
      },
    },
    typeDefs: [
      ...mutationTypeDefs,
    ],
  });

  return schema;
};

export default createSchema;
