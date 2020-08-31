// THIS IS A GENERATED FILE, DO NOT MODIFY

/* eslint-disable */
/* tslint:disable */

import IndexModel from '../../db/models/index';
import PetModel from '../../db/models/pet';
import UserModel from '../../db/models/user';
import { GraphQLResolveInfo } from 'graphql';
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
};

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  primaryPets: PetConnection;
  pets: PetConnection;
  resolvedField: Scalars['String'];
};


export type UserPrimaryPetsArgs = {
  conditions?: Maybe<Array<Maybe<PetConditions>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Maybe<PetOrder>>>;
  direction?: Maybe<OrderDirection>;
};


export type UserPetsArgs = {
  conditions?: Maybe<Array<Maybe<PetConditions>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Maybe<PetOrder>>>;
  direction?: Maybe<OrderDirection>;
};

export type PetConnection = {
  __typename?: 'PetConnection';
  nodes: Array<Maybe<Pet>>;
  totalCount: Scalars['Int'];
};

export type PetConditions = {
  id?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Array<Maybe<Scalars['String']>>>;
  longField?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdAt?: Maybe<Array<Maybe<Scalars['String']>>>;
  updatedAt?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  id?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdAt?: Maybe<Array<Maybe<Scalars['String']>>>;
  updatedAt?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Pet = {
  __typename?: 'Pet';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  longField?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  primaryOwner?: Maybe<User>;
  owners: UserConnection;
};


export type PetPrimaryOwnerArgs = {
  id: Scalars['String'];
};


export type PetOwnersArgs = {
  conditions?: Maybe<Array<Maybe<UserConditions>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Maybe<UserOrder>>>;
  direction?: Maybe<OrderDirection>;
};

export enum PetOrder {
  NAME = 'NAME',
  LONG_FIELD = 'LONG_FIELD',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT'
}

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users: UserConnection;
  pet?: Maybe<Pet>;
  pets: PetConnection;
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


export type QueryPetArgs = {
  id: Scalars['String'];
};


export type QueryPetsArgs = {
  conditions?: Maybe<Array<Maybe<PetConditions>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Maybe<PetOrder>>>;
  direction?: Maybe<OrderDirection>;
};

export type CreatePersonInput = {
  name: Scalars['String'];
};

export type CreatePersonResponse = {
  __typename?: 'CreatePersonResponse';
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPerson: CreatePersonResponse;
};


export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
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
  User: ResolverTypeWrapper<UserModel>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  PetConnection: ResolverTypeWrapper<Omit<PetConnection, 'nodes'> & { nodes: Array<Maybe<ResolversTypes['Pet']>> }>;
  PetConditions: PetConditions;
  UserConnection: ResolverTypeWrapper<Omit<UserConnection, 'nodes'> & { nodes: Array<Maybe<ResolversTypes['User']>> }>;
  UserOrder: UserOrder;
  UserConditions: UserConditions;
  Pet: ResolverTypeWrapper<PetModel>;
  PetOrder: PetOrder;
  Query: ResolverTypeWrapper<{}>;
  CreatePersonInput: CreatePersonInput;
  CreatePersonResponse: ResolverTypeWrapper<Omit<CreatePersonResponse, 'user'> & { user: ResolversTypes['User'] }>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  User: UserModel;
  String: Scalars['String'];
  Int: Scalars['Int'];
  PetConnection: Omit<PetConnection, 'nodes'> & { nodes: Array<Maybe<ResolversParentTypes['Pet']>> };
  PetConditions: PetConditions;
  UserConnection: Omit<UserConnection, 'nodes'> & { nodes: Array<Maybe<ResolversParentTypes['User']>> };
  UserConditions: UserConditions;
  Pet: PetModel;
  Query: {};
  CreatePersonInput: CreatePersonInput;
  CreatePersonResponse: Omit<CreatePersonResponse, 'user'> & { user: ResolversParentTypes['User'] };
  Mutation: {};
  Boolean: Scalars['Boolean'];
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primaryPets?: Resolver<ResolversTypes['PetConnection'], ParentType, ContextType, RequireFields<UserPrimaryPetsArgs, 'conditions' | 'limit' | 'offset' | 'orderBy' | 'direction'>>;
  pets?: Resolver<ResolversTypes['PetConnection'], ParentType, ContextType, RequireFields<UserPetsArgs, 'conditions' | 'limit' | 'offset' | 'orderBy' | 'direction'>>;
  resolvedField?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type PetConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PetConnection'] = ResolversParentTypes['PetConnection']> = ResolversObject<{
  nodes?: Resolver<Array<Maybe<ResolversTypes['Pet']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type UserConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = ResolversObject<{
  nodes?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type PetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Pet'] = ResolversParentTypes['Pet']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  longField?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primaryOwner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<PetPrimaryOwnerArgs, 'id'>>;
  owners?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<PetOwnersArgs, 'conditions' | 'limit' | 'offset' | 'orderBy' | 'direction'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'conditions' | 'limit' | 'offset' | 'orderBy' | 'direction'>>;
  pet?: Resolver<Maybe<ResolversTypes['Pet']>, ParentType, ContextType, RequireFields<QueryPetArgs, 'id'>>;
  pets?: Resolver<ResolversTypes['PetConnection'], ParentType, ContextType, RequireFields<QueryPetsArgs, 'conditions' | 'limit' | 'offset' | 'orderBy' | 'direction'>>;
}>;

export type CreatePersonResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CreatePersonResponse'] = ResolversParentTypes['CreatePersonResponse']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPerson?: Resolver<ResolversTypes['CreatePersonResponse'], ParentType, ContextType, RequireFields<MutationCreatePersonArgs, 'input'>>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  User?: UserResolvers<ContextType>;
  PetConnection?: PetConnectionResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  Pet?: PetResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  CreatePersonResponse?: CreatePersonResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>;
