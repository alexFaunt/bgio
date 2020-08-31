import { mergeSchemas } from '@graphql-tools/merge';

import createMutationDefinitions from 'server/graphql/mutations';
import createAutomaticSchema from 'server/graphql/schema/auto';



const createSchema = async () => {
  const autoSchema = await createAutomaticSchema();
  // TBH just redo this shit?
  const { resolvers: Mutation, typeDefs: mutationTypeDefs } = await createMutationDefinitions();
  // console.log('AUTO', autoSchema.getQueryType()?.getFields())

  // Can merge schemas with custom types + resolvers
  const customType = `type User { resolvedField: String! }`;



  const schema = mergeSchemas({
    schemas: [autoSchema],
    resolvers: {
      // can add custom resolvers here - but not fields, so can only do privacy stuff. Might be able to extend type User
      Mutation,
      // CreatePersonResponse: {
      //   user: async (parent, ...args) => {
      //     // Hmmm - can't easily resolve this shit back onto the main schema
      //     // I guess could federate them together somehow... this is all garbag tbh
      //     return parent.user;
      //   },
      // },
      User: {
        resolvedField: (one) => {
          return 'hi'
        },
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
