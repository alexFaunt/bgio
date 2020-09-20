import Router from 'koa-router';

import createApolloServer from 'server/graphql';
import { Config } from 'server/config';
import createBoardGameServer from 'server/board-game';
import createPool from 'server/db/pool';

// TODO, break these off to their own servers instead? e.g. Have game.sevenhand.com - graph.sevenhand.com

const createServer = async (config: Config) => {
  // Add any custom routes TODO - do these come first? e.g. can wrap the others?
  const router = new Router();
  router.get('/health', (ctx) => {
    ctx.body = { hello: 'there' };
  });

  // Can block everything we don't want someone to use... with some kind of secret to unblock it for our proxies?
  // router.post('/games/seven-hand-poker/create', (ctx) => {
  //   ctx.status = 404;
  //   ctx.body = { message: 'Not Found' };
  // });

  const connection = {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    database: config.POSTGRES_DB,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
  };
  const pool = {
    min: config.KNEX_POOL_MIN,
    max: config.KNEX_POOL_MAX,
  };
  const apolloDbPool = createPool({ connection, pool });
  const authStateDbPool = createPool({ connection, pool });

  // This is the koa server - it doesn't allow us to export as middleware
  const boardGameServer = createBoardGameServer({ connection });

  // Middleware wrapped around all others

  boardGameServer.app.use(async (ctx, next) => {
    const userSecret = ctx.headers['x-shp-user-secret'];

    if (userSecret) {
      // TODO hoist models?
      const res = await authStateDbPool.from('users').select('id').where({ secret: userSecret }).first();
      // error handle? hahaha
      ctx.state.auth = {
        user: {
          id: res?.id,
          secret: userSecret,
        },
      };
    } else {
      ctx.state.auth = {};
    }

    return next();
  });

  // Apollo server for other content on /graphql
  const apolloServer = await createApolloServer({
    db: apolloDbPool,
    url: `http://0.0.0.0:${config.SERVER_PORT}`,
  });

  boardGameServer.app.use(
    apolloServer.getMiddleware({ path: '/graphql', cors: false }),
  );

  boardGameServer.app.use(router.routes()).use(router.allowedMethods());

  return boardGameServer;
};

export default createServer;
