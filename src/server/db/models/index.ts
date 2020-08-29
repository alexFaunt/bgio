import { Model } from 'objection';

import UserModel from 'server/db/models/user';
import PetModel from 'server/db/models/pet';

// TODO, think i should be fine to just generate
const models: Model[] = [UserModel, PetModel];

export default models;
