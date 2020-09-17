import models from 'server/db/models';

export type GraphQLContext = {
  auth: {
    user: {
      id: string,
    },
  },
  models: typeof models,
};
