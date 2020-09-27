import Knex, { CreateTableBuilder } from 'knex';

const isPrime = (num: number) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i += 1) {
    if (num % i === 0) {
      return false;
    }
  }
  return num > 1;
};

type SecretSauce = {
  ic: number,
  im: number,
  ia: number,
};

const generateSecretSauce = (): SecretSauce => {
  const im = Math.round(100000 + Math.random() * 899999); // Pick a random 6 digit number for im
  const ia = Math.round(1000 + Math.random() * 8999); // Pick a random 4 digit number for ia

  // Look for a decent prime value for ic within 20 of the value (1/2 - root(3)/6)*im
  const exact = ((0.5 - (Math.sqrt(3) / 6)) * im);
  const rounded = Math.round(exact);
  let diff = 0;
  let ic: number | null = null;
  const maxRange = 20;

  while (diff < maxRange && ic === null) {
    if (isPrime(rounded + diff)) {
      ic = rounded + diff;
    }
    if (isPrime(rounded - diff)) {
      ic = rounded - diff;
    }

    diff += 1;
  }

  if (!ic) {
    console.log('Failed to find a decent set of secret sauce numbers - starting over');
    return generateSecretSauce();
  }

  return {
    ic,
    im,
    ia,
  };
};

type SequenceNameArgs = {
  tableName: string,
  columnName?: string,
};

export const getSequenceName = ({ tableName, columnName = 'id' }: SequenceNameArgs) => (
  `${tableName}_${columnName}_seed`
);

type DestroyIdArgs = {
  tableName: string,
  columnName?: string,
};

export const destroyIdFactory = (knex: Knex) => async ({ tableName, columnName = 'id' }: DestroyIdArgs) => {
  await knex.raw(`
    DROP FUNCTION IF EXISTS create_${tableName}_${columnName}(bigint);

    DROP SEQUENCE IF EXISTS ${getSequenceName({ tableName, columnName })};
  `);
};

type CreateIdArgs = {
  tableName: string,
  prefix: string,
  columnName?: string,
};

export const idCreatorFactory = (knex: Knex) => async ({
  tableName,
  prefix,
  // destroy = false, // Create an id destroyer instead
  columnName = 'id', // Can specify a column name rather than use id (probably useful for fixing the old ones)
}: CreateIdArgs) => {
  const secrets = generateSecretSauce();

  if (prefix.length !== 3) {
    throw new Error('Prefix for id values should be 3 characters long');
  }

  // Function to create a string id from a seed
  // Used in conjunction with a serial id as a seed to ensure unique random ids for all rows
  // The prefix is hard coded in to ensure no one re-uses this function for other tables
  // Use the function to generate us random non colliding string ids using a sequence
  await knex.raw(`
    CREATE FUNCTION create_${tableName}_${columnName}(input bigint) RETURNS text LANGUAGE plpgsql AS $$
      DECLARE
        l1 bigint;
        l2 bigint;
        r1 bigint;
        r2 bigint;
        i int:=0;

      BEGIN
        l1:= (input >> 32) & 4294967295::bigint;
        r1:= input & 4294967295;

        WHILE i < 3 LOOP
          l2 := r1;
          r2 := l1 # ((((${secrets.ia}.0 * r1 + ${secrets.ic}) % ${secrets.im}) / ${secrets.im}.0) * 32767*32767)::int;
          l1 := l2;
          r1 := r2;
          i := i + 1;
        END LOOP;

      RETURN concat('${prefix}_', stringify_bigint((l1::BIGINT << 32) + r1));
    END $$
    ;

    CREATE SEQUENCE ${getSequenceName({ tableName, columnName })} INCREMENT BY 1 START WITH 1;
  `);

  return (table: CreateTableBuilder) => table.string(columnName).defaultTo(knex.raw(
    `create_${tableName}_${columnName}(nextval('${tableName}_${columnName}_seed'))`,
  ));
};

export type IdCreator = ReturnType<typeof idCreatorFactory>;
export type DestroyId = ReturnType<typeof destroyIdFactory>;
