import {
  Model,
  HasOneRelation,
  BelongsToOneRelation,
  HasOneThroughRelation,
  HasManyRelation,
  ManyToManyRelation,
} from 'objection';
import models from 'server/db/models';
import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLInputObjectType } from 'graphql';
import pluralize from 'pluralize';
import { jsonSchemaToGraphQLFields } from 'server/graphql/objection/json-schema';
import defaultArgFactories, { basicOperator } from 'server/graphql/objection/arg-factories';

import { camelCase, snakeCase } from 'lodash/fp';

const argNames = {
  eq: 'Eq',
  gt: 'Gt',
  gte: 'Gte',
  lt: 'Lt',
  lte: 'Lte',
  like: 'Like',
  isNull: 'IsNull',
  likeNoCase: 'LikeNoCase',
  in: 'In',
  notIn: 'NotIn',
  orderBy: 'orderBy',
  orderByDesc: 'orderByDesc',
  range: 'range',
  limit: 'limit',
  offset: 'offset',
};

const getNames = (model: Model) => {
  // TODO - what about like if the table name has _ in it? plural is weird?
  const fieldName = pluralize.singular(model.tableName);
  const connectionFieldName = camelCase(fieldName);
  const typeName = `${connectionFieldName.substring(0, 1).toUpperCase()}${connectionFieldName.substring(1)}`;
  const connectionTypeName = `${typeName}Connection`;
  const orderByTypeName = `${typeName}Order`;
  const conditionTypeName = `${typeName}Conditions`;

  return { fieldName, connectionFieldName, typeName, connectionTypeName, orderByTypeName, conditionTypeName };
};

const getRelationTypeName = ({ relation, modelClass }) => {
  const { typeName, connectionTypeName } = getNames(modelClass);

  if (
    relation === HasOneRelation ||
    relation === BelongsToOneRelation ||
    relation === HasOneThroughRelation
  ) {
    return typeName;
  }

  if (relation === HasManyRelation || relation === ManyToManyRelation) {
    // TODO
    return connectionTypeName;
  }

  throw new Error(`relation type "${relation.constructor.name}" is not supported`);
};

const createAutomaticSchema = () => {
  const types = {
    OrderDirection: new GraphQLEnumType({
      name: 'OrderDirection',
      values: {
        ASC: { value: 'ASC' },
        DESC: { value: 'DESC' },
      },
    }),
  };
  const typeArgs = {};
  const queryFields = {};

  models.forEach((model: Model) => {
    const {
      fieldName,
      connectionFieldName,
      typeName,
      connectionTypeName,
      orderByTypeName,
      conditionTypeName,
    } = getNames(model);

    const columnFields = jsonSchemaToGraphQLFields(model.jsonSchema, { typeCache: types, typeNamePrefix: typeName });

    const type = new GraphQLObjectType({
      name: typeName,
      fields: () => ({
        ...columnFields,
        ...Object.entries(model.relationMappings).reduce((acc, [relationName, relation]) => {
          const relationTypeName = getRelationTypeName(relation);

          acc[relationName] = {
            type: types[relationTypeName],
            args: typeArgs[relationTypeName],
            // resolver
          };

          return acc;
        }, {}),
      }),
    });

    const connectionType = GraphQLNonNull(new GraphQLObjectType({
      name: connectionTypeName,
      fields: {
        nodes: {
          type: GraphQLNonNull(new GraphQLList(type)),
        },
        totalCount: {
          type: GraphQLNonNull(GraphQLInt),
        },
      },
    }));

    const orderByType = new GraphQLEnumType({
      name: orderByTypeName,
      values: Object.keys(columnFields).reduce((acc, columnName) => {
        // Don't order by id - could make this configurable using columnFields or jsonSchema
        if (columnName === 'id') {
          return acc;
        }
        const enumName = snakeCase(columnName).toUpperCase();
        acc[enumName] = { value: enumName };
        return acc;
      }, {}),
    });

    // Only let you select singular by id right now
    const singleArgs = {
      id: {
        type: GraphQLNonNull(columnFields.id.type), // required - at least until we add a second
      },
    };

    const conditionType = new GraphQLInputObjectType({
      name: conditionTypeName,
      fields: Object.entries(columnFields).reduce((acc, [column, field]) => {
        acc[column] = {
          type: new GraphQLList(field.type),
        };
        // Can add the other filters here e.g. gt/lt/like

        return acc;
      }, {}),
    });

    const connectionArgs = {
      conditions: { type: conditionType, defaultValue: [] },
      limit: { type: GraphQLInt, defaultValue: 0 },
      offset: { type: GraphQLInt, defaultValue: 0 },
      // TODO pull defaultOrder from json schema?
      orderBy: { type: new GraphQLList(orderByType), defaultValue: 'CREATED_AT' },
      direction: { type: types.OrderDirection, defaultValue: 'DESC' },
    };

    // Save types
    types[typeName] = type;
    types[connectionTypeName] = connectionType;
    types[orderByTypeName] = orderByType;
    types[conditionTypeName] = conditionType;

    // Save args
    typeArgs[typeName] = singleArgs;
    typeArgs[connectionTypeName] = connectionArgs;

    // Create root level query object
    queryFields[connectionFieldName] = {
      type,
      args: singleArgs,
    };
    queryFields[fieldName] = {
      type: connectionType,
      args: connectionArgs,
    };
  });

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: queryFields,
  });

  return new GraphQLSchema({ query, types: Object.values(types) });
};

export default createAutomaticSchema;
