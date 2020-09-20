import migrator from 'server/db/migrator';

export const { up, down } = migrator(__filename, {
  requires: '0.0.3',
  migration: async ({ knex, idCreator }) => {
    const createUserId = await idCreator({
      tableName: 'users',
      prefix: 'usr',
    });

    const createUserSecret = await idCreator({
      tableName: 'users',
      prefix: 'usc',
      columnName: 'secret',
    });

    await knex.schema.createTable('users', (table) => {
      createUserId(table).primary();
      createUserSecret(table);
      table.string('name');
      table.timestamps(true, true);

      table.index('secret');
    });
  },
  rollback: async ({ knex, destroyId }) => {
    destroyId({ tableName: 'users' });
    destroyId({ tableName: 'users', columnName: 'secret' });
    await knex.schema.dropTable('users');
  },
});
