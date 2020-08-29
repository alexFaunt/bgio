import BaseModel from 'server/db/base-model';
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
      longField: { type: 'string' }, // TODO should this be camel or not?
       // TODO can it be required?
       // TODO shared common ones?
      createdAt: { type: 'string' }, // TODO date validator?
      updatedAt: { type: 'string' }, // TODO date validator?
    },
  };

  static get relationMappings() {
    return {
      primaryOwner: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'pets.primary_owner_id',
          to: 'users.id',
        },
      },
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
