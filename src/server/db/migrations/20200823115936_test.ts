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

    const createPetId = await idCreator({
      tableName: 'pets',
      prefix: 'pet',
    });

    await knex.schema.createTable('pets', (table) => {
      createPetId(table).primary();
      table.string('name');
      table.string('owner_id');
      table.timestamps(true, true);

      table.foreign('owner_id').references('id').inTable('users');
    });
  },
  rollback: async ({ knex, destroyId }) => {
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('pets');

    await destroyId({ tableName: 'users' });
    await destroyId({ tableName: 'pets' });
  },
});
