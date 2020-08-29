import BaseModel from 'server/db/base-model';
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
      createdAt: { type: 'string' }, // TODO date validator?
      updatedAt: { type: 'string' }, // TODO date validator?
    },
  };

  static get relationMappings() {
    return {
      primaryPets: {
        relation: BaseModel.HasManyRelation,
        modelClass: PetModel,
        join: {
          from: 'users.id',
          to: 'pets.primary_owner_id',
        },
      },
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
