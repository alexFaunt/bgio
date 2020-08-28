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

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  pet?: Maybe<Pet>;
  pets?: Maybe<Array<Maybe<Pet>>>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idEq?: Maybe<Scalars['String']>;
  nameEq?: Maybe<Scalars['String']>;
  idGt?: Maybe<Scalars['String']>;
  nameGt?: Maybe<Scalars['String']>;
  idGte?: Maybe<Scalars['String']>;
  nameGte?: Maybe<Scalars['String']>;
  idLt?: Maybe<Scalars['String']>;
  nameLt?: Maybe<Scalars['String']>;
  idLte?: Maybe<Scalars['String']>;
  nameLte?: Maybe<Scalars['String']>;
  idLike?: Maybe<Scalars['String']>;
  nameLike?: Maybe<Scalars['String']>;
  idIsNull?: Maybe<Scalars['Boolean']>;
  nameIsNull?: Maybe<Scalars['Boolean']>;
  idIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idLikeNoCase?: Maybe<Scalars['String']>;
  nameLikeNoCase?: Maybe<Scalars['String']>;
  orderBy?: Maybe<UserPropertiesEnum>;
  orderByDesc?: Maybe<UserPropertiesEnum>;
  range?: Maybe<Array<Maybe<Scalars['Int']>>>;
  limit?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type QueryUsersArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idEq?: Maybe<Scalars['String']>;
  nameEq?: Maybe<Scalars['String']>;
  idGt?: Maybe<Scalars['String']>;
  nameGt?: Maybe<Scalars['String']>;
  idGte?: Maybe<Scalars['String']>;
  nameGte?: Maybe<Scalars['String']>;
  idLt?: Maybe<Scalars['String']>;
  nameLt?: Maybe<Scalars['String']>;
  idLte?: Maybe<Scalars['String']>;
  nameLte?: Maybe<Scalars['String']>;
  idLike?: Maybe<Scalars['String']>;
  nameLike?: Maybe<Scalars['String']>;
  idIsNull?: Maybe<Scalars['Boolean']>;
  nameIsNull?: Maybe<Scalars['Boolean']>;
  idIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idLikeNoCase?: Maybe<Scalars['String']>;
  nameLikeNoCase?: Maybe<Scalars['String']>;
  orderBy?: Maybe<UserPropertiesEnum>;
  orderByDesc?: Maybe<UserPropertiesEnum>;
  range?: Maybe<Array<Maybe<Scalars['Int']>>>;
  limit?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type QueryPetArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idEq?: Maybe<Scalars['String']>;
  nameEq?: Maybe<Scalars['String']>;
  idGt?: Maybe<Scalars['String']>;
  nameGt?: Maybe<Scalars['String']>;
  idGte?: Maybe<Scalars['String']>;
  nameGte?: Maybe<Scalars['String']>;
  idLt?: Maybe<Scalars['String']>;
  nameLt?: Maybe<Scalars['String']>;
  idLte?: Maybe<Scalars['String']>;
  nameLte?: Maybe<Scalars['String']>;
  idLike?: Maybe<Scalars['String']>;
  nameLike?: Maybe<Scalars['String']>;
  idIsNull?: Maybe<Scalars['Boolean']>;
  nameIsNull?: Maybe<Scalars['Boolean']>;
  idIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idLikeNoCase?: Maybe<Scalars['String']>;
  nameLikeNoCase?: Maybe<Scalars['String']>;
  orderBy?: Maybe<PetPropertiesEnum>;
  orderByDesc?: Maybe<PetPropertiesEnum>;
  range?: Maybe<Array<Maybe<Scalars['Int']>>>;
  limit?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type QueryPetsArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idEq?: Maybe<Scalars['String']>;
  nameEq?: Maybe<Scalars['String']>;
  idGt?: Maybe<Scalars['String']>;
  nameGt?: Maybe<Scalars['String']>;
  idGte?: Maybe<Scalars['String']>;
  nameGte?: Maybe<Scalars['String']>;
  idLt?: Maybe<Scalars['String']>;
  nameLt?: Maybe<Scalars['String']>;
  idLte?: Maybe<Scalars['String']>;
  nameLte?: Maybe<Scalars['String']>;
  idLike?: Maybe<Scalars['String']>;
  nameLike?: Maybe<Scalars['String']>;
  idIsNull?: Maybe<Scalars['Boolean']>;
  nameIsNull?: Maybe<Scalars['Boolean']>;
  idIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idLikeNoCase?: Maybe<Scalars['String']>;
  nameLikeNoCase?: Maybe<Scalars['String']>;
  orderBy?: Maybe<PetPropertiesEnum>;
  orderByDesc?: Maybe<PetPropertiesEnum>;
  range?: Maybe<Array<Maybe<Scalars['Int']>>>;
  limit?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pets?: Maybe<Array<Maybe<Pet>>>;
};


export type UserPetsArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idEq?: Maybe<Scalars['String']>;
  nameEq?: Maybe<Scalars['String']>;
  idGt?: Maybe<Scalars['String']>;
  nameGt?: Maybe<Scalars['String']>;
  idGte?: Maybe<Scalars['String']>;
  nameGte?: Maybe<Scalars['String']>;
  idLt?: Maybe<Scalars['String']>;
  nameLt?: Maybe<Scalars['String']>;
  idLte?: Maybe<Scalars['String']>;
  nameLte?: Maybe<Scalars['String']>;
  idLike?: Maybe<Scalars['String']>;
  nameLike?: Maybe<Scalars['String']>;
  idIsNull?: Maybe<Scalars['Boolean']>;
  nameIsNull?: Maybe<Scalars['Boolean']>;
  idIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idLikeNoCase?: Maybe<Scalars['String']>;
  nameLikeNoCase?: Maybe<Scalars['String']>;
  orderBy?: Maybe<PetPropertiesEnum>;
  orderByDesc?: Maybe<PetPropertiesEnum>;
  limit?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type Pet = {
  __typename?: 'Pet';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  owners?: Maybe<Array<Maybe<User>>>;
};


export type PetOwnersArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idEq?: Maybe<Scalars['String']>;
  nameEq?: Maybe<Scalars['String']>;
  idGt?: Maybe<Scalars['String']>;
  nameGt?: Maybe<Scalars['String']>;
  idGte?: Maybe<Scalars['String']>;
  nameGte?: Maybe<Scalars['String']>;
  idLt?: Maybe<Scalars['String']>;
  nameLt?: Maybe<Scalars['String']>;
  idLte?: Maybe<Scalars['String']>;
  nameLte?: Maybe<Scalars['String']>;
  idLike?: Maybe<Scalars['String']>;
  nameLike?: Maybe<Scalars['String']>;
  idIsNull?: Maybe<Scalars['Boolean']>;
  nameIsNull?: Maybe<Scalars['Boolean']>;
  idIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  nameNotIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  idLikeNoCase?: Maybe<Scalars['String']>;
  nameLikeNoCase?: Maybe<Scalars['String']>;
  orderBy?: Maybe<UserPropertiesEnum>;
  orderByDesc?: Maybe<UserPropertiesEnum>;
  limit?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export enum UserPropertiesEnum {
  id = 'id',
  name = 'name'
}

export enum PetPropertiesEnum {
  id = 'id',
  name = 'name'
}

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
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  User: ResolverTypeWrapper<UserModel>;
  Pet: ResolverTypeWrapper<PetModel>;
  UserPropertiesEnum: UserPropertiesEnum;
  PetPropertiesEnum: PetPropertiesEnum;
  CreatePersonInput: CreatePersonInput;
  CreatePersonResponse: ResolverTypeWrapper<Omit<CreatePersonResponse, 'user'> & { user: ResolversTypes['User'] }>;
  Mutation: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  User: UserModel;
  Pet: PetModel;
  CreatePersonInput: CreatePersonInput;
  CreatePersonResponse: Omit<CreatePersonResponse, 'user'> & { user: ResolversParentTypes['User'] };
  Mutation: {};
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, never>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryUsersArgs, never>>;
  pet?: Resolver<Maybe<ResolversTypes['Pet']>, ParentType, ContextType, RequireFields<QueryPetArgs, never>>;
  pets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Pet']>>>, ParentType, ContextType, RequireFields<QueryPetsArgs, never>>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Pet']>>>, ParentType, ContextType, RequireFields<UserPetsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type PetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Pet'] = ResolversParentTypes['Pet']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owners?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<PetOwnersArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type CreatePersonResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CreatePersonResponse'] = ResolversParentTypes['CreatePersonResponse']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPerson?: Resolver<ResolversTypes['CreatePersonResponse'], ParentType, ContextType, RequireFields<MutationCreatePersonArgs, 'input'>>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Pet?: PetResolvers<ContextType>;
  CreatePersonResponse?: CreatePersonResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>;
