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

const defaultConditions = [];
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
      // Conditions could be an array of objects or an object
      const conditions = value.kind === 'ObjectValue'
        ? [value.fields]
        : value.values.map(({ fields }) => fields);

      // eslint-disable-next-line no-param-reassign
      argAcc[name.value] = conditions.map((condition) => (
        condition.reduce((valueAcc, field) => {
          // eslint-disable-next-line no-param-reassign
          valueAcc[field.name.value] = field.value.value;
          return valueAcc;
        }, {})
      ));

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

  // TODO Conditions really needs testing...
  (argMap.conditions || defaultConditions).forEach((conds) => {
    builder.orWhere(conds);
  });
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

    if (!isListRelation(relationInfo.relation)) {
      // It's not a list relation, so it's a single object
      // recurse down to next level without a modifier
      acc.push(getEagerString({
        fieldName: child,
        node: selection,
        model: relationInfo.modelClass,
        modifiers,
      }));

      return acc;
    }

    // Lists get a modifier function to filter / limit them
    const modifierName = `f${modifiers.length}`;

    // Push a filter into to the modifiers array
    const modifier = createListModifier(selection);
    modifiers.push({ [modifierName]: modifier });

    // If query includes nodes recurse to it
    const selectionNode = selection.selectionSet.selections.find(({ name }) => name.value === 'nodes');
    if (selectionNode) {
      acc.push(getEagerString({
        // It's a list relation, so append a fX modifier function to apply list filters
        fieldName: `${child}(${modifierName})`,
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

    const conditionType = new GraphQLList(new GraphQLInputObjectType({
      name: conditionTypeName,
      fields: Object.entries(columnFields).reduce((acc, [column, field]) => {
        acc[column] = {
          type: new GraphQLList(field.type),
        };
        // Can add the other filters here e.g. gt/lt/like

        return acc;
      }, {}),
    }));

    const connectionArgs = {
      conditions: { type: conditionType, defaultValue: defaultConditions },
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
        // TODO - graph joined doesn't work with nested limits
        // Best we could do with objection is to break it up, each list field just stop and let the next resolver do it
        // Or we could drop it and write in SQL
        // Just gonna finish re-building objection-graphql, which was a giant waste of time anyway
        queryBuilder.withGraphFetched(eager);
        // .withGraphJoined(eager)

        if (modifiers.length) {
          queryBuilder.modifiers(Object.assign(...modifiers));
        }
      }

      // TODO try catch ?
      const dbResponse = await queryBuilder;

      return expandConnections(dbResponse);
    };

    const resolveFieldType = async (parent, args, context, info) => {
      // TODO validate args
      const queryBuilder = model.query().first();

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

      // TODO curry this properly...
      createListModifier(info.fieldNodes[0])(queryBuilder);

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
