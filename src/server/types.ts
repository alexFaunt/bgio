import { Context as KoaContext } from 'koa';

type State = {
  auth: { // TODO
    id: string,
  },
};

// TODO - where to put this when the auth middleware exists
// TODO how the fuck do you add custom state to Koa app
export type Context = KoaContext;
