import { Model } from 'objection';
import { mapKeys, snakeCase, camelCase } from 'lodash';

class BaseModel extends Model {
  createdAt: string;
  updatedAt: string;

  $formatDatabaseJson(data: { [key: string]: unknown }) {
    const json = super.$formatDatabaseJson(data);

    return mapKeys(json, (value, key) => snakeCase(key));
  }

  $parseDatabaseJson(data: { [key: string]: unknown }) {
    const json = mapKeys(data, (value, key) => camelCase(key));

    return super.$parseDatabaseJson(json);
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default BaseModel;
