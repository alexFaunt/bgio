import BaseModel from 'server/db/models/base';
import UserModel from 'server/db/models/user';

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
      owners: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: 'pets.id',
          to: 'users.id',
          through: {
            from: 'user_pets.pet_id',
            to: 'user_pets.user_id',
          },
        },
      },
    };
  }
}

export default PetModel;
