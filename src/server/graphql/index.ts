import { ApolloServer } from 'apollo-server-koa';
import { Model } from 'objection';
import Knex from 'knex';

import createSchema from 'server/graphql/schema';
import { Context } from 'server/types';
import models from 'server/db/models';
import createBgioProxy from 'server/graphql/bgio-proxy';

type CreateApolloServerArgs = {
  db: Knex;
  url: string;
};

const publicAuth = () => {};

const createApolloServer = async ({ db, url }: CreateApolloServerArgs) => {
  Model.knex(db);

  const schema = await createSchema();

  const bgioProxy = createBgioProxy(url);

  return new ApolloServer<ApolloContext>({
    schema,
    context: async ({ ctx: { state: { auth } } }: { ctx: Context }) => {
      // build up auth functions - invoked when needed so can be lazy - defaults to no modifier
      const authModifiers = {
        get authUser() {
          return publicAuth;
        },
      };

      return {
        auth,
        authModifiers,
        models,
        bgioProxy,
      };
    },
  });
};

export default createApolloServer;
