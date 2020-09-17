import BaseModel from 'server/db/base-model';

class UserModel extends BaseModel {
  static tableName = 'users';

  // TODO - google if you can generate jsonSchema from postgres... must be doable
  static jsonSchema = {
    type: 'object',
    title: 'User',
    required: ['name'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 3, maxLength: 255 },
      createdAt: { type: 'string' }, // TODO date validator?
      updatedAt: { type: 'string' }, // TODO date validator?
    },
  };

  static get relationMappings() {
    return {};
  }
}

export default UserModel;
