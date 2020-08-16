import { Server } from 'boardgame.io/server';
import SevenHandPoker from ('server/game');

const server = Server({
  games: [SevenHandPoker],
});

server.run(8000);
