import { Server } from 'boardgame.io/server';
import Router from 'koa-router';

import SevenHandPoker from 'common/game';

// TODO config
// eslint-disable-next-line no-process-env
const { SERVER_PORT = '8001' } = process.env;

const server = Server({
  games: [SevenHandPoker],
});

// Custom routes
const router = new Router();
router.get('/health', (ctx) => {
  ctx.body = { hello: 'there' };
});
server.app.use(router.routes()).use(router.allowedMethods());

// TODO, break this off to it's own server?
// Have game.sevenhand.com - graph.sevenhand.com
server.app.use(
  apollo.getMiddleware({ path: '/graphql', cors: false }),
);

// Game server (can't use as middleware)
server.run(
  parseInt(SERVER_PORT, 10),
  // TODO logger.
  // eslint-disable-next-line no-console
  () => console.log(`Doing server things ${SERVER_PORT}`),
);
