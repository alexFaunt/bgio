import path from 'path';
import getConfig from 'server/config';

const config = getConfig();

const migrationConfig = {
  client: 'postgresql',
  connection: config.DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  debug: false,
};

export default migrationConfig;
