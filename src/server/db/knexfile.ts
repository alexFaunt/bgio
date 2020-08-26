import path from 'path';
import getConfig from 'server/config';

const config = getConfig();

const migrationConfig = {
  client: 'postgresql',
  connection: {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DB,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  debug: false,
};

export default migrationConfig;
