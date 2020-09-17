import migrator from 'server/db/migrator';

export const { up, down } = migrator(__filename, {
  requires: '0.0.3',
  migration: async ({ knex, idCreator }) => {
    const createUserId = await idCreator({
      tableName: 'users',
      prefix: 'usr',
    });

    await knex.schema.createTable('users', (table) => {
      createUserId(table).primary();
      table.string('name');
      table.timestamps(true, true);
    });
  },
  rollback: async ({ knex }) => {
    await knex.schema.dropTable('users');
  },
});
