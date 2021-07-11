import path from 'path';

const migrationConfig = {
  client: 'postgresql',
  // eslint-disable-next-line no-process-env
  connection: `${process.env.DATABASE_URL}?sslmode=require`,
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  debug: false,
};

export default migrationConfig;
