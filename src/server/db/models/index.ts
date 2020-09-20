import GameModel from 'server/db/models/game';
import UserModel from 'server/db/models/user';

// TODO, think i should be fine to just generate
const models = {
  game: GameModel,
  user: UserModel,
};

export default models;
