import Router from 'koa-router';

import createApolloServer from 'server/graphql';
import { Config } from 'server/config';
import createBoardGameServer from 'server/board-game';

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

  // This is the koa server - it doesn't allow us to export as middleware
  const boardGameServer = createBoardGameServer({ connection });

  // Middleware wrapped around all others
  boardGameServer.app.use((ctx, next) => {
    // TODO get auth from header
    ctx.state = ctx.state || {};
    ctx.state.auth = {
      user: {
        id: 1,
      },
    };

    return next();
  });

  // Apollo server for other content on /graphql
  const apolloServer = await createApolloServer({
    connection,
    pool: {
      min: config.KNEX_POOL_MIN,
      max: config.KNEX_POOL_MAX,
    },
  });
  boardGameServer.app.use(
    apolloServer.getMiddleware({ path: '/graphql', cors: false }),
  );

  boardGameServer.app.use(router.routes()).use(router.allowedMethods());

  return boardGameServer;
};

export default createServer;
