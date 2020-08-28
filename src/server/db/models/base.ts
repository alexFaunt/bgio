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

export default BaseModel;
