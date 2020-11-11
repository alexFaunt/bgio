// THIS IS A GENERATED FILE, DO NOT MODIFY

/* eslint-disable */
/* tslint:disable */

import GameModel from '../../db/models/game';
import UserModel from '../../db/models/user';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from './context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type Game = {
  __typename?: 'Game';
  id?: Maybe<Scalars['String']>;
  gameName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user0?: Maybe<User>;
  user1?: Maybe<User>;
  players: Array<Player>;
  status: GameStatusEnum;
  currentPlayer?: Maybe<User>;
  turnNumber?: Maybe<Scalars['Int']>;
  result?: Maybe<GameResult>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  nodes: Array<Maybe<Game>>;
  totalCount: Scalars['Int'];
};

export enum GameOrder {
  GAME_NAME = 'GAME_NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT'
}

export type GameConditions = {
  id?: Maybe<Scalars['String']>;
  gameName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  status?: Maybe<GameStatusEnum>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  resolvedField: Scalars['String'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  nodes: Array<Maybe<User>>;
  totalCount: Scalars['Int'];
};

export enum UserOrder {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT'
}

export type UserConditions = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  game?: Maybe<Game>;
  games: GameConnection;
  user?: Maybe<User>;
  users: UserConnection;
};


export type QueryGameArgs = {
  id: Scalars['String'];
};


export type QueryGamesArgs = {
  conditions?: Maybe<Array<Maybe<GameConditions>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Maybe<GameOrder>>>;
  direction?: Maybe<OrderDirection>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  conditions?: Maybe<Array<Maybe<UserConditions>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Maybe<UserOrder>>>;
  direction?: Maybe<OrderDirection>;
};


export type CreateGameInput = {
  creatingUserId: Scalars['String'];
};

export type CreateGameResponse = {
  __typename?: 'CreateGameResponse';
  gameId: Scalars['String'];
  playerId: Scalars['String'];
  playerCredentials: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: CreateGameResponse;
  createUser: CreateUserResponse;
  joinGame: JoinGameResponse;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationJoinGameArgs = {
  input: JoinGameInput;
};

export type CreateUserInput = {
  name: Scalars['String'];
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  user: User;
  secret: Scalars['String'];
};

export type JoinGameInput = {
  gameId: Scalars['String'];
  userId: Scalars['String'];
  playerId: Scalars['String'];
};

export type JoinGameResponse = {
  __typename?: 'JoinGameResponse';
  playerCredentials: Scalars['String'];
};

export type PlayerCondition = {
  userId?: Maybe<Scalars['String']>;
};

export enum GameStatusEnum {
  COMPLETE = 'COMPLETE',
  PENDING = 'PENDING',
  PLAYING = 'PLAYING',
  UNKNOWN = 'UNKNOWN'
}

export enum GameOutcome {
  DRAW = 'DRAW',
  VICTORY = 'VICTORY'
}

export type GameResult = {
  __typename?: 'GameResult';
  outcome: GameOutcome;
  endedAt: Scalars['DateTime'];
  winner?: Maybe<User>;
  loser?: Maybe<User>;
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['String'];
  open: Scalars['Boolean'];
  user?: Maybe<User>;
  credentials?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  OrderDirection: OrderDirection;
  Game: ResolverTypeWrapper<GameModel>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  GameConnection: ResolverTypeWrapper<Omit<GameConnection, 'nodes'> & { nodes: Array<Maybe<ResolversTypes['Game']>> }>;
  GameOrder: GameOrder;
  GameConditions: GameConditions;
  User: ResolverTypeWrapper<UserModel>;
  UserConnection: ResolverTypeWrapper<Omit<UserConnection, 'nodes'> & { nodes: Array<Maybe<ResolversTypes['User']>> }>;
  UserOrder: UserOrder;
  UserConditions: UserConditions;
  Query: ResolverTypeWrapper<{}>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  CreateGameInput: CreateGameInput;
  CreateGameResponse: ResolverTypeWrapper<CreateGameResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  CreateUserInput: CreateUserInput;
  CreateUserResponse: ResolverTypeWrapper<Omit<CreateUserResponse, 'user'> & { user: ResolversTypes['User'] }>;
  JoinGameInput: JoinGameInput;
  JoinGameResponse: ResolverTypeWrapper<JoinGameResponse>;
  PlayerCondition: PlayerCondition;
  GameStatusEnum: GameStatusEnum;
  GameOutcome: GameOutcome;
  GameResult: ResolverTypeWrapper<Omit<GameResult, 'winner' | 'loser'> & { winner?: Maybe<ResolversTypes['User']>, loser?: Maybe<ResolversTypes['User']> }>;
  Player: ResolverTypeWrapper<Omit<Player, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Game: GameModel;
  String: Scalars['String'];
  Int: Scalars['Int'];
  GameConnection: Omit<GameConnection, 'nodes'> & { nodes: Array<Maybe<ResolversParentTypes['Game']>> };
  GameConditions: GameConditions;
  User: UserModel;
  UserConnection: Omit<UserConnection, 'nodes'> & { nodes: Array<Maybe<ResolversParentTypes['User']>> };
  UserConditions: UserConditions;
  Query: {};
  DateTime: Scalars['DateTime'];
  CreateGameInput: CreateGameInput;
  CreateGameResponse: CreateGameResponse;
  Mutation: {};
  CreateUserInput: CreateUserInput;
  CreateUserResponse: Omit<CreateUserResponse, 'user'> & { user: ResolversParentTypes['User'] };
  JoinGameInput: JoinGameInput;
  JoinGameResponse: JoinGameResponse;
  PlayerCondition: PlayerCondition;
  GameResult: Omit<GameResult, 'winner' | 'loser'> & { winner?: Maybe<ResolversParentTypes['User']>, loser?: Maybe<ResolversParentTypes['User']> };
  Player: Omit<Player, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  Boolean: Scalars['Boolean'];
}>;

export type GameResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user0?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user1?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['GameStatusEnum'], ParentType, ContextType>;
  currentPlayer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  turnNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['GameResult']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type GameConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GameConnection'] = ResolversParentTypes['GameConnection']> = ResolversObject<{
  nodes?: Resolver<Array<Maybe<ResolversTypes['Game']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resolvedField?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type UserConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = ResolversObject<{
  nodes?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<QueryGameArgs, 'id'>>;
  games?: Resolver<ResolversTypes['GameConnection'], ParentType, ContextType, RequireFields<QueryGamesArgs, 'limit' | 'offset' | 'orderBy' | 'direction'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'limit' | 'offset' | 'orderBy' | 'direction'>>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type CreateGameResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CreateGameResponse'] = ResolversParentTypes['CreateGameResponse']> = ResolversObject<{
  gameId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  playerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  playerCredentials?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createGame?: Resolver<ResolversTypes['CreateGameResponse'], ParentType, ContextType, RequireFields<MutationCreateGameArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['CreateUserResponse'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  joinGame?: Resolver<ResolversTypes['JoinGameResponse'], ParentType, ContextType, RequireFields<MutationJoinGameArgs, 'input'>>;
}>;

export type CreateUserResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CreateUserResponse'] = ResolversParentTypes['CreateUserResponse']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  secret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type JoinGameResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JoinGameResponse'] = ResolversParentTypes['JoinGameResponse']> = ResolversObject<{
  playerCredentials?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type GameResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GameResult'] = ResolversParentTypes['GameResult']> = ResolversObject<{
  outcome?: Resolver<ResolversTypes['GameOutcome'], ParentType, ContextType>;
  endedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  winner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  loser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type PlayerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  open?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  credentials?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Game?: GameResolvers<ContextType>;
  GameConnection?: GameConnectionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  CreateGameResponse?: CreateGameResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  CreateUserResponse?: CreateUserResponseResolvers<ContextType>;
  JoinGameResponse?: JoinGameResponseResolvers<ContextType>;
  GameResult?: GameResultResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>;

export type AutoResolvers = {
  Game: ResolverFn<ResolverTypeWrapper<Game>, unknown, GraphQLContext, { id: string }>,
  User: ResolverFn<ResolverTypeWrapper<User>, unknown, GraphQLContext, { id: string }>,
}
type CreateGameResolverResponse = Record<keyof Omit<CreateGameResponse, '__typename'>, { id: string }>;
export type CreateGameResolver = Resolver<CreateGameResolverResponse, unknown, GraphQLContext, RequireFields<MutationCreateGameArgs, 'input'>>;
type CreateUserResolverResponse = Record<keyof Omit<CreateUserResponse, '__typename'>, { id: string }>;
export type CreateUserResolver = Resolver<CreateUserResolverResponse, unknown, GraphQLContext, RequireFields<MutationCreateUserArgs, 'input'>>;
type JoinGameResolverResponse = Record<keyof Omit<JoinGameResponse, '__typename'>, { id: string }>;
export type JoinGameResolver = Resolver<JoinGameResolverResponse, unknown, GraphQLContext, RequireFields<MutationJoinGameArgs, 'input'>>;