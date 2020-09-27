import migrator from 'server/db/migrator';

// Only works if the games table has already been created...
export const { up, down } = migrator(__filename, {
  migration: async ({ knex }) => {
    await knex.raw('DROP TABLE IF EXISTS "Games"');
    // This is what bgio runs to create the games table
    // I do it here because i need it to exist before I can add the updated_at column
    // This is garbage but whatever leave me alone.

    // eslint-disable-next-line max-len
    await knex.raw('CREATE TABLE IF NOT EXISTS "Games" ("id" VARCHAR(255) UNIQUE , "gameName" VARCHAR(255), "players" JSON, "setupData" JSON, "gameover" JSON, "nextRoomID" VARCHAR(255), "unlisted" BOOLEAN, "state" JSON, "initialState" JSON, "log" JSON, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));');

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
