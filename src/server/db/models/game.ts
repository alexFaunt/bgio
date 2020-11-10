import BaseModel from 'server/db/base-model';
import UserModel from 'server/db/models/user';
import { ref } from 'objection';

class GameModel extends BaseModel {
  static tableName = 'Games';
  static get modifiers() {
    return {
      userId(builder, id) {
        builder
          .andWhere(function userIdModifier() {
            this.whereRaw('"players" -> \'0\' ->> \'name\' = ?', [id])
              .orWhereRaw('"players" -> \'1\' ->> \'name\' = ?', [id]);
          });
      },
      status(builder, status) {
        if (status === 'COMPLETE') {
          builder
            .andWhere(function statusCompleteModifier() {
              this.whereRaw('"state" -> \'ctx\' ->> \'gameover\' is not NULL');
            });
        }

        if (status === 'PENDING') {
          builder
            .andWhere(function statusPendingModifier() {
              this.whereRaw('"players" -> \'1\' ->> \'name\' is NULL');
            });
        }

        if (status === 'PLAYING') {
          builder
            .andWhere(function statusPendingModifier() {
              this.whereRaw('"players" -> \'1\' ->> \'name\' is not NULL')
                .andWhereRaw('"state" -> \'ctx\' ->> \'gameover\' is NULL');
            });
        }
      },
    };
  }

  // TODO - google if you can generate jsonSchema from postgres... must be doable
  static jsonSchema = {
    type: 'object',
    title: 'User',
    required: ['name'],
    properties: {
      id: { type: 'string' },
      gameName: { type: 'string' },
      // players: {
      //   type: 'object',
      //   properties: {
      //     player0: {
      //       type: 'object',
      //       properties: {
      //         id: { type: 'number' },
      //         name: { type: 'string' }, // This is player ID can I FK to this?
      //         credentials: { type: 'string' },
      //       },
      //     },
      //     player1: {
      //       type: 'object',
      //       properties: {
      //         id: { type: 'number' },
      //         name: { type: 'string' }, // This is player ID can I FK to this?
      //         credentials: { type: 'string' },
      //       },
      //     },
      //   },
      // },
      createdAt: { type: 'string' }, // TODO date validator?
      updatedAt: { type: 'string' }, // TODO date validator?
    },
  };

  static get relationMappings() {
    return {
      user0: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: ref('Games.players:0.name'),
          to: 'users.id',
        },
      },
      user1: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: ref('Games.players:1.name'),
          to: 'users.id',
        },
      },
    };
  }
}

export default GameModel;
