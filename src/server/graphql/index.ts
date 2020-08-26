import { ApolloServer } from 'apollo-server-koa';
import { Model } from 'objection';
// import { builder as SchemaBuilder } from 'objection-graphql';
import { SchemaBuilder } from 'server/graphql/objection/schema-builder';

import { Context } from 'server/types';
import createPool, { Connection, Pool } from 'server/db/pool';
import models from 'server/db/models';

type CreateApolloServerArgs = {
  connection: Connection;
  pool: Pool;
};

const createApolloServer = ({ connection, pool }: CreateApolloServerArgs) => {
  const dbPool = createPool({ connection, pool });

  Model.knex(dbPool);

  const schema = new SchemaBuilder()
    .allModels(models) // TODO middleware. Also it doesn't do totalCount - not sure what pagination is like
    .selectFiltering(false)
    .build();

  return new ApolloServer({
    schema,
    context: async ({ ctx: { state: { auth } } }: { ctx: Context }) => ({
      auth,
    }),
  });
};

export default createApolloServer;