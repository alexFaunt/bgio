import { ApolloServer } from 'apollo-server-koa';
import { Model } from 'objection';

import createSchema from 'server/graphql/schema';
import { Context } from 'server/types';
import createPool, { Connection, Pool } from 'server/db/pool';

type CreateApolloServerArgs = {
  connection: Connection;
  pool: Pool;
};

const createApolloServer = async ({ connection, pool }: CreateApolloServerArgs) => {
  const dbPool = createPool({ connection, pool });

  Model.knex(dbPool);

  const schema = await createSchema();

  return new ApolloServer({
    schema,
    context: async ({ ctx: { state: { auth } } }: { ctx: Context }) => {
      // console.log('GraphQL context', auth);
      return { auth };
    },
  });
};

export default createApolloServer;
