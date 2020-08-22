import { Context as KoaContext } from 'koa';

type State = {
  auth: { // TODO
    id: string,
  },
};

// TODO - where to put this when the auth middleware exists
export type Context = KoaContext<State>;
