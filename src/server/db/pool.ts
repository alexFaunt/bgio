import knex from 'knex';

export type Connection = {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
};

export type Pool = {
  min: number,
  max: number,
};

type PoolArgs = {
  connection: Connection,
  pool: Pool,
  debug?: boolean,
};

const createPool = ({ connection, pool, debug = true }: PoolArgs) => {
  const instance = knex({
    client: 'pg',
    connection,
    pool,
  });

  if (debug) {
    // Knex has a debug option to print every SQL statement ran, but it's not very good for
    // our purposes (multiline, not interpolated, etc), so we need to hack it a bit to get
    // something more readable.
    instance.client.on('query', (statement: { [key: string]: string }) => {
      // eslint-disable-next-line no-underscore-dangle
      const query = instance.client._formatQuery(statement.sql, statement.bindings, 'UTC');
      return console.debug(query);
    });
  }

  return instance;
};

export default createPool;
