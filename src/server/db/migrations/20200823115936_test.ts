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
      table.string('long_field');
      table.string('primary_owner_id').notNullable();
      table.foreign('primary_owner_id').references('id').inTable('users');
      table.timestamps(true, true);
    });

    await knex.schema.createTable('user_pets', (table) => {
      table.string('user_id').notNullable();
      table.string('pet_id').notNullable();
      table.timestamps(true, true);

      table.foreign('user_id').references('id').inTable('users');
      table.foreign('pet_id').references('id').inTable('pets');
    });
  },
  rollback: async ({ knex, destroyId }) => {
    await knex.schema.dropTable('user_pets');
    await knex.schema.dropTable('pets');
    await knex.schema.dropTable('users');

    await destroyId({ tableName: 'users' });
    await destroyId({ tableName: 'pets' });
  },
});
