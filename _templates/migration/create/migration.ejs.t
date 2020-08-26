---
to: src/server/db/migrations/<%= filename %>
sh: npm --no-git-tag-version version -f <%= version %>
---
import migrator from 'server/db/migrator';

export const { up, down } = migrator(__filename, {
  requires: '<%= version %>',
  migration: async ({ knex, idCreator }) => {
    // Creating new entities with ID:
    const createId = await idCreator({
      tableName: 'kiki',
      prefix: 'kik',
    });

    // Creating a new table:
    await knex.schema.createTable('kiki', (table) => {
      createId(table).primary();

      table.string('name');
      table.boolean('doors_locked').notNullable();
      table.integer('lock_tightness').unsigned();

      table.string('tea_id').notNullable();
      table.foreign('tea_id').references('id').inTable('tea');

      // Automatic created_at and updated_at
      table.timestamps(true, true);
    });

    // Altering an existing table
    await knex.schema.alterTable('tea', (table) => {
      table.string('name').notNullable().alter();
      table.float('strength').unsigned().notNullable().alter();
    });
  },
  rollback: async ({ knex, destroyId }) => {
    await knex.schema.alterTable('tea', (table) => {
      table.dropColumn('name');
      table.dropColumn('strength');
    });

    await knex.schema.dropTable('kiki');

    // Needed to remove the ID:
    await destroyId({ tableName: 'kiki' });
  },
});
