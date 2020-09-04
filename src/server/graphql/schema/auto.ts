import pluralize from 'pluralize';
import {
  Model,
  HasOneRelation,
  BelongsToOneRelation,
  HasOneThroughRelation,
  HasManyRelation,
  ManyToManyRelation,
} from 'objection';
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import models from 'server/db/models';
import { jsonSchemaToGraphQLFields } from 'server/graphql/objection/json-schema';

import { camelCase, snakeCase } from 'lodash/fp';

const defaultLimit = 0;
const defaultOffset = 0;
const defaultOrderBy = 'CREATED_AT';
const defaultDirection = 'DESC';

const expandConnections = (item) => {
  if (!item) {
    return null;
  }

  if (Array.isArray(item)) {
    return {
      nodes: item.map(expandConnections),
    };
  }

  if (typeof item === 'object') {
    return Object.entries(item).reduce((acc, [key, child]) => {
      acc[key] = expandConnections(child);
      return acc;
    }, {});
  }

  return item;
};

const getNames = (model: Model) => {
  const fieldName = camelCase(pluralize.singular(model.tableName));
  const connectionFieldName = camelCase(model.tableName);
  const typeName = `${fieldName.substring(0, 1).toUpperCase()}${fieldName.substring(1)}`;
  const connectionTypeName = `${typeName}Connection`;
  const orderByTypeName = `${typeName}Order`;
  const conditionTypeName = `${typeName}Conditions`;

  return { fieldName, connectionFieldName, typeName, connectionTypeName, orderByTypeName, conditionTypeName };
};

const isListRelation = (relation) => relation === HasManyRelation || relation === ManyToManyRelation;

const getRelationTypeName = ({ relation, modelClass }) => {
  const { typeName, connectionTypeName } = getNames(modelClass);

  if (
    relation === HasOneRelation ||
    relation === BelongsToOneRelation ||
    relation === HasOneThroughRelation
  ) {
    return typeName;
  }

  if (isListRelation(relation)) {
    return connectionTypeName;
  }

  throw new Error(`relation type "${relation.constructor.name}" is not supported`);
};

const createListModifier = (selection) => (builder) => {
  const argMap = selection.arguments.reduce((argAcc, { name, value }) => {
    if (name.value === 'conditions') {
      // eslint-disable-next-line no-param-reassign
      argAcc.conditions = value.fields.reduce((valueAcc, field) => {
        // eslint-disable-next-line no-param-reassign
        valueAcc[snakeCase(field.name.value)] = field.value.value;
        return valueAcc;
      }, {});

      return argAcc;
    }
    // eslint-disable-next-line no-param-reassign
    argAcc[name.value] = value.value;

    return argAcc;
  }, {});

  // TODO order could be an array
  const order = argMap.orderBy || defaultOrderBy;
  const direction = argMap.direction || defaultDirection;

  builder.limit(parseInt(argMap.limit, 10) || defaultLimit);
  builder.offset(parseInt(argMap.offset, 10) || defaultOffset);
  builder.orderByRaw(`?? ${direction} NULLS LAST`, [order.toLowerCase()]);

  // "andWhere" so it combos with auth modifiers
  if (argMap.conditions) {
    builder.andWhere(argMap.conditions);
  }
};

const getEagerString = ({ node, modifiers, fieldName, model }) => {
  const { selections } = node.selectionSet;

  const subSelection = selections.reduce((acc, selection) => {
    const child = selection.name.value;

    const relationInfo = model.relationMappings[child];

    // It's not a relation so it's just a column or none of our business so the eager string stops here
    if (!relationInfo) {
      return acc;
    }

    // Lists get a modifier function to filter / limit them
    const authModifierName = `auth${getNames(relationInfo.modelClass).typeName}`;

    if (!isListRelation(relationInfo.relation)) {
      // It's not a list relation, so it's a single object

      acc.push(getEagerString({
        fieldName: `${child}(${authModifierName})`,
        node: selection,
        model: relationInfo.modelClass,
        modifiers,
      }));

      return acc;
    }

    // Lists get a modifier function to filter / limit them
    const modifierName = `f${modifiers.length}`;

    // Push a filter into to the modifiers array
    modifiers.push({ [modifierName]: createListModifier(selection) });

    // If query includes nodes recurse to it
    const selectionNode = selection.selectionSet.selections.find(({ name }) => name.value === 'nodes');
    if (selectionNode) {
      acc.push(getEagerString({
        fieldName: `${child}(${modifierName},${authModifierName})`,
        node: selectionNode,
        model: relationInfo.modelClass,
        modifiers,
      }));
    }

    return acc;
  }, []).join(', ');

  if (subSelection.length) {
    const subString = `[${subSelection}]`;
    return fieldName ? `${fieldName}.${subString}` : subString;
  }

  return fieldName;
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
  const resolvers = {};

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
            // Don't need this until we work out how to use eagerJoinAlgoritm with broken up tree
            // resolve: async (parent, args, context, info) => {
            //   console.log('RESOLVE THING', parent);
            //   if (parent[relationName]) {
            //     return parent[relationName];
            //   }

            //   const id = `${relationName}Id`;
            //   if (parent[id]) {
            //     return resolvers[relationTypeName]({}, { id: parent[id] }, context, info);
            //   }

            //   return null;
            // },
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
        // Don't order by id - could make this configurable using jsonSchema?
        if (columnName === 'id') {
          return acc;
        }
        const enumName = snakeCase(columnName).toUpperCase();
        acc[enumName] = { value: enumName };
        return acc;
      }, {}),
    });

    // Singular instead of [{}, {}] which would be nicer, because needs to combo with auth filters, this is easier.
    const conditionType = new GraphQLList(new GraphQLInputObjectType({
      name: conditionTypeName,
      fields: columnFields,
    }));

    const connectionArgs = {
      conditions: { type: conditionType },
      limit: { type: GraphQLInt, defaultValue: defaultLimit },
      offset: { type: GraphQLInt, defaultValue: defaultOffset },
      // TODO pull defaultOrder from json schema?
      orderBy: { type: new GraphQLList(orderByType), defaultValue: defaultOrderBy },
      direction: { type: types.OrderDirection, defaultValue: defaultDirection },
    };

    // Save types
    types[typeName] = type;
    types[connectionTypeName] = connectionType;
    types[orderByTypeName] = orderByType;
    types[conditionTypeName] = conditionType;

    // Save args
    typeArgs[connectionTypeName] = connectionArgs;

    const loadTree = async ({ queryBuilder, node }) => {
      // This gets modified - not really a pattern i like but :shrug:
      const modifiers = [];

      const eager = getEagerString({
        node,
        fieldName: '',
        model,
        modifiers,
      });

      if (eager.length) {
        console.log('EAGER', eager);
        // TODO - graph joined doesn't work with nested limits
        // Best we could do with objection is to break it up, each list field just stop and let the next resolver do it
        // Or we could drop it and write in SQL
        // Just gonna finish re-building objection-graphql, which was a giant waste of time anyway
        queryBuilder.withGraphFetched(eager);
        // .withGraphJoined(eager)

        const argModifiers = Object.assign({}, ...modifiers);
        queryBuilder.modifiers(argModifiers);
      }

      // TODO try catch ?
      const dbResponse = await queryBuilder;

      return expandConnections(dbResponse);
    };

    const resolveFieldType = async (parent, args, context, info) => {
      // TODO validate args
      // TODO might need to .modify() this with auth arg for right type
      const queryBuilder = model.query().first();
      queryBuilder.modifiers(context.authModifiers);

      const argEntries = Object.entries(args);
      if (argEntries.length) {
        const scopedArgs = argEntries.reduce((acc, [key, value]) => {
          acc[`${model.tableName}.${key}`] = value;
          return acc;
        }, {});
        queryBuilder.where(scopedArgs);
      }

      return loadTree({ queryBuilder, node: info.fieldNodes[0] });
    };

    const resolveListFieldType = async (parent, args, context, info) => {
      const queryBuilder = model.query();

      // Add list modifiers to top level query
      queryBuilder.modify(createListModifier(info.fieldNodes[0]));

      // Add auth modifiers where needed
      queryBuilder.modifiers(context.authModifiers);
      // TODO might need to .modify() this with auth arg for right type
      queryBuilder.modify(`auth${typeName}`);

      const selectionNode = info.fieldNodes[0].selectionSet.selections.find(({ name }) => name.value === 'nodes');

      return loadTree({ queryBuilder, node: selectionNode });
    };

    // Create root level query object
    queryFields[fieldName] = {
      type,
      args: {
        id: {
          type: GraphQLNonNull(columnFields.id.type),
        },
      },
      resolve: resolveFieldType,
    };
    resolvers[typeName] = resolveFieldType;

    queryFields[connectionFieldName] = {
      type: connectionType,
      args: connectionArgs,
      resolve: resolveListFieldType,
    };
  });

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: queryFields,
  });

  return {
    schema: new GraphQLSchema({ query, types: Object.values(types) }),
    resolvers,
  };
};

export default createAutomaticSchema;