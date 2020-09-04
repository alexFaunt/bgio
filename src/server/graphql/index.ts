import { ApolloServer } from 'apollo-server-koa';
import { Model } from 'objection';

import createSchema from 'server/graphql/schema';
import { Context } from 'server/types';
import createPool, { Connection, Pool } from 'server/db/pool';
// import models from 'server/db/models';

type CreateApolloServerArgs = {
  connection: Connection;
  pool: Pool;
};

const publicAuth = () => {};

const createApolloServer = async ({ connection, pool }: CreateApolloServerArgs) => {
  const dbPool = createPool({ connection, pool });

  Model.knex(dbPool);

  const schema = await createSchema();

  return new ApolloServer({
    schema,
    context: async ({ ctx: { state: { auth } } }: { ctx: Context }) => {
      // build up auth functions - invoked when needed so can be lazy
      const authModifiers = {
        get authUser() {
          console.log('authUser');
          return publicAuth;
        },
        get authPet() {
          console.log('authPet');
          return (qb) => qb.andWhere({ id: 'b' });
          return publicAuth;
        },
      };

      return {
        auth,
        authModifiers,
      };
    },
  });
};

export default createApolloServer;
