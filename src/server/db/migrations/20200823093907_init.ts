import migrator from 'server/db/migrator';

export const { up, down } = migrator(__filename, {
  migration: async ({ knex }) => {
    await knex.raw(`
      CREATE OR REPLACE FUNCTION stringify_bigint(input bigint) RETURNS text LANGUAGE plpgsql AS $$
        DECLARE
          alphabet text:='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          base int:=length(alphabet);
          abs_input bigint:=abs(input);
          output text:='';

        BEGIN
          WHILE abs_input > 0 LOOP
            output := output || substr(alphabet, 1+(abs_input%base)::int, 1);
            abs_input := abs_input / base;
          END LOOP;

        RETURN output;
      END $$
      ;
    `);
  },
  rollback: async ({ knex }) => {
    await knex.raw('DROP FUNCTION stringify_bigint(input bigint)');
  },
});
