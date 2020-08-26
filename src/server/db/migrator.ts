/* eslint-disable no-process-env */

import path from 'path';
import semver from 'semver-compare';
import Knex from 'knex';

import {
  idCreatorFactory,
  IdCreator,
  destroyIdFactory,
  DestroyId,
} from 'server/db/functions/create-id';

// eslint-disable-next-line no-restricted-imports
import npmPackage from '../../../package.json';

export type Migration = ({ knex, idCreator }: { knex: Knex, idCreator: IdCreator }) => void;
export type Rollback = ({ knex, destroyId }: { knex: Knex, destroyId: DestroyId }) => void;

export type MigrationDefinition = {
  requires: string,
  migration: Migration,
  rollback: Rollback,
};

const migrator = (pathname: string, { requires, migration, rollback }: MigrationDefinition) => {
  const name = path.basename(pathname, path.extname(pathname));

  if (!name) {
    throw new Error('Unable to retrieve a name from the migration filename');
  }

  const { version } = npmPackage;

  return {
    up: async (knex: Knex) => {
      if (semver(version, requires) !== 0 && process.env.ALLOW_UNSAFE_DEPLOYMENTS !== 'true') {
        throw new Error(`Unsatisfied migration requirement. Required version: ${requires}, running: ${version}`);
      }

      console.info(`[migrator] Running migration "${name}"`);

      return migration({
        knex,
        idCreator: idCreatorFactory(knex),
      });
    },
    down: async (knex: Knex) => {
      if (process.env.ALLOW_DATABASE_ROLLBACKS !== 'true') {
        throw new Error('Database rollbacks are not allowed.');
      }

      console.info(`[migrator] Running rollback for "${name}"`);

      return rollback({
        knex,
        destroyId: destroyIdFactory(knex),
      });
    },
  };
};

export default migrator;
