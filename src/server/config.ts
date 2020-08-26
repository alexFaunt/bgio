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
  POSTGRES_DB: {
    doc: 'Database name',
    format: String,
    default: null,
  },
  POSTGRES_HOST: {
    doc: 'Database host',
    format: String,
    default: null,
  },
  POSTGRES_PASSWORD: {
    doc: 'Database password',
    format: String,
    default: null,
    sensitive: true,
  },
  POSTGRES_PORT: {
    doc: 'Database port',
    format: 'port',
    default: null,
  },
  POSTGRES_USER: {
    doc: 'Database user',
    format: String,
    default: null,
    sensitive: true,
  },
  SERVER_PORT: {
    doc: 'Server port',
    format: 'port',
    default: null,
  },
};

export type Config = {
  SERVER_PORT: number,
  KNEX_POOL_MIN: number,
  KNEX_POOL_MAX: number,
  POSTGRES_DB: string,
  POSTGRES_HOST: string,
  POSTGRES_PASSWORD: string,
  POSTGRES_PORT: number,
  POSTGRES_USER: string,
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
