import migrator from 'server/db/migrator';

// Only works if the games table has already been created...
export const { up, down } = migrator(__filename, {
  migration: async ({ knex }) => {
    await knex.raw('CREATE TABLE IF NOT EXISTS Games (createdAt timestamptz)');

    await knex.raw('ALTER TABLE "Games" ADD COLUMN created_at timestamptz GENERATED ALWAYS AS ("createdAt") STORED');
    await knex.raw('ALTER TABLE "Games" ADD COLUMN updated_at timestamptz GENERATED ALWAYS AS ("updatedAt") STORED');
  },
  rollback: async ({ knex }) => {
    await knex.schema.alterTable('Games', (table) => {
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    });
  },
});
