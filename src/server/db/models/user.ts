import BaseModel from 'server/db/models/base';
import PetModel from 'server/db/models/pet';

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
        relation: BaseModel.ManyToManyRelation,
        modelClass: PetModel,
        join: {
          from: 'users.id',
          to: 'pets.id',
          through: {
            from: 'user_pets.user_id',
            to: 'user_pets.pet_id',
          },
        },
      },
    };
  }
}

export default UserModel;
