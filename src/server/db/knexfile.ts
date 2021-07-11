import path from 'path';

const migrationConfig = {
  client: 'postgresql',
  connection: {
    // eslint-disable-next-line no-process-env
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  debug: false,
};

export default migrationConfig;
