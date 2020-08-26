import { Model } from 'objection';
import { mapKeys, snakeCase, camelCase } from 'lodash';

class BaseModel extends Model {
  created_at?: string;
  updated_at?: string;

  $formatDatabaseJson(data: { [key: string]: unknown }) {
    const json = super.$formatDatabaseJson(data);

    return mapKeys(json, (value, key) => snakeCase(key));
  }

  $parseDatabaseJson(data: { [key: string]: unknown }) {
    const json = mapKeys(data, (value, key) => camelCase(key));

    return super.$parseDatabaseJson(json);
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

// Might need to fork objection-graphql it's stale and unmaintained - or just don't use it / pull out the builder
// Need to replace typeNameForModel https://github.com/Vincit/objection-graphql/blob/master/lib/utils.js
// so we can convert users -> User
// https://github.com/Vincit/objection-graphql/pull/61/files

// Also need the PR to merge to add totalCount to pagination / change the output

class PetModel extends BaseModel {
  static tableName = 'pets';

  // TODO - google if you can generate jsonSchema from postgres... must be doable
  static jsonSchema = {
    type: 'object',
    title: 'Pet',
    required: ['name'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 5, maxLength: 255 },
    },
  };

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'pets.owner_id',
          to: 'users.id',
        },
      },
    };
  }
}

class UserModel extends BaseModel {
  static tableName = 'users';

  // TODO - google if you can generate jsonSchema from postgres... must be doable
  static jsonSchema = {
    type: 'object',
    title: 'User',
    required: ['name'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 5, maxLength: 255 },
    },
  };

  static get relationMappings() {
    return {
      pets: {
        relation: Model.HasManyRelation,
        modelClass: PetModel,
        join: {
          from: 'users.id',
          to: 'pets.owner_id',
        },
      },
    };
  }
}

export default [UserModel, PetModel];
