import models from 'server/db/models';
import createBgioProxy from 'server/graphql/bgio-proxy';

type AuthUser = {
  id: string, // TODO
  secret: string,
};

export type GraphQLContext = {
  auth: {
    user?: AuthUser,
  },
  models: typeof models,
  bgioProxy: ReturnType<typeof createBgioProxy>,
};
