import { Server } from 'boardgame.io/server';
import Router from 'koa-router';

import SevenHandPoker from 'common/game';

// TODO config
const { SERVER_PORT = '8001' } = process.env;

const server = Server({
  games: [SevenHandPoker],
});

const router = new Router();

// custom api routes if needed, can't sub-route the game server though? kinda annoying
router.get('/api', (ctx) => {
  ctx.body = {
    hello: 'there',
  }
});

server.app.use(router.routes()).use(router.allowedMethods())

server.run(
  parseInt(SERVER_PORT, 10),
  () => console.log(`Doing server things ${SERVER_PORT}`),
);
