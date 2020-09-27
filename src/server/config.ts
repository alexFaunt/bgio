import convict, { Schema } from 'convict';

const schema = {
  KNEX_POOL_MIN: {
    doc: 'Minimum number of db connections in pool',
    format: Number,
    default: 2,
  },
  KNEX_POOL_MAX: {
    doc: 'Maximum number of db connections in pool',
    format: Number,
    default: 10,
  },
  PORT: {
    doc: 'Server port',
    format: 'port',
    default: null,
  },
  DATABASE_URL: {
    doc: 'DB URL supplied by heroku instead of postgres strings',
    format: String,
    default: null,
    sensitive: true,
  },
};

export type Config = {
  PORT: number,
  KNEX_POOL_MIN: number,
  KNEX_POOL_MAX: number,
  DATABASE_URL: string,
};

const entries = Object.keys(schema).reduce((acc, key) => ({
  ...acc,
  [key]: {
    ...schema[key as keyof typeof schema],
    env: key,
  },
}), {}) as Schema<Config>;

const getConfig = () => {
  const configuration = convict<Config>(entries);

  configuration.validate({ allowed: 'strict' });

  return configuration.getProperties();
};

export default getConfig;
