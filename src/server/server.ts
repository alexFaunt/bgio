import Router from 'koa-router';

import createApolloServer from 'server/graphql';
import { Config } from 'server/config';
import createBoardGameServer from 'server/board-game';
import createPool from 'server/db/pool';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// TODO, break these off to their own servers instead? e.g. Have game.sevenhand.com - graph.sevenhand.com

const publicPath = path.resolve(__dirname, '../client/public');
let indexFile;
const readFile = promisify(fs.readFile);

const createServer = async (config: Config) => {
  const pool = {
    min: config.KNEX_POOL_MIN,
    max: config.KNEX_POOL_MAX,
  };
  const connection = {
    connectionString: config.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  const apolloDbPool = createPool({ connection, pool });
  const authStateDbPool = createPool({ connection, pool });

  // This is the koa server - it doesn't allow us to export as middleware
  const boardGameServer = createBoardGameServer({ dbUrl: config.DATABASE_URL });

  // Apollo server for other content on /graphql
  const apolloServer = await createApolloServer({
    db: apolloDbPool,
    url: `http://0.0.0.0:${config.PORT}`,
  });

  // Add any custom routes TODO - do these come first? e.g. can wrap the others?
  const router = new Router();
  router.get('/health', (ctx) => {
    ctx.body = { hello: 'there' };
  });

  // Serve the index file on any route (this needs to be after all other routes...)
  // This is only used in prod - webpack-dev-server is used locally
  router.get('(.*)', async (ctx) => {
    if (!indexFile) {
      indexFile = await readFile(path.join(publicPath, 'index.html'), { encoding: 'utf8' });
    }

    ctx.body = indexFile;
  });

  // Can block everything we don't want someone to use... with some kind of secret to unblock it for our proxies?
  // router.post('/games/seven-hand-poker/create', (ctx) => {
  //   ctx.status = 404;
  //   ctx.body = { message: 'Not Found' };
  // });

  // Middleware wrapped around all others
  boardGameServer.app.use(async (ctx, next) => {
    const userSecret = ctx.headers['x-shp-user-secret'];

    if (userSecret) {
      // TODO hoist models rather than go direct?
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

  // Apollo server on /graphql
  boardGameServer.app.use(
    apolloServer.getMiddleware({ path: '/graphql', cors: false }),
  );

  // Host build assets
  boardGameServer.app.use(mount('/static', serve(publicPath)));

  // use routes (including * which goes to index)
  boardGameServer.app.use(router.routes()).use(router.allowedMethods());

  return boardGameServer;
};

export default createServer;
