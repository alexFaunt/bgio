/* eslint-disable @typescript-eslint/ban-ts-comment */
// Given up typing this file don't really care proof is in the pudding and it only deals with auto generated stuff
// means it can't be statically analysed anyway so who cares.
// @ts-nocheck

import pluralize from 'pluralize';
import { Model, RelationType } from 'objection';
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  FieldNode,
  ObjectValueNode,
} from 'graphql';
import models from 'server/db/models';
import { jsonSchemaToGraphQLFields } from 'server/graphql/objection/json-schema';
import { AutoResolvers } from 'server/graphql/definitions';

import { camelCase, snakeCase } from 'lodash/fp';
import Knex from 'knex';

const defaultLimit = 0;
const defaultOffset = 0;
const defaultOrderBy = 'CREATED_AT';
const defaultDirection = 'DESC';

type ModelType = typeof Model;

const expandConnections = (item: unknown): unknown => {
  if (item == null) {
    return null;
  }

  if (Array.isArray(item)) {
    return {
      nodes: item.map(expandConnections),
    };
  }

  if (item instanceof Date) {
    return item;
  }

  if (typeof item === 'object') {
    return Object.entries(item).reduce((acc, [key, child]) => {
      acc[key] = expandConnections(child);
      return acc;
    }, {} as { [key: string]: unknown });
  }

  return item;
};

const getNames = (model: ModelType) => {
  const fieldName = camelCase(pluralize.singular(model.tableName.toLowerCase()));
  const connectionFieldName = camelCase(model.tableName.toLowerCase());
  const typeName = `${fieldName.substring(0, 1).toUpperCase()}${fieldName.substring(1)}`;
  const connectionTypeName = `${typeName}Connection`;
  const orderByTypeName = `${typeName}Order`;
  const conditionTypeName = `${typeName}Conditions`;

  return { fieldName, connectionFieldName, typeName, connectionTypeName, orderByTypeName, conditionTypeName };
};

const isListRelation = (relation: RelationType) => (
  relation === Model.HasManyRelation || relation === Model.ManyToManyRelation
);

const getRelationTypeName = ({ relation, modelClass }: { relation: RelationType, modelClass: ModelType }) => {
  const { typeName, connectionTypeName } = getNames(modelClass);

  if (
    relation === Model.HasOneRelation ||
    relation === Model.BelongsToOneRelation ||
    relation === Model.HasOneThroughRelation
  ) {
    return typeName;
  }

  if (isListRelation(relation)) {
    return connectionTypeName;
  }

  throw new Error(`relation type "${relation.constructor.name}" is not supported`);
};

const createListModifier = (selection: FieldNode, model: ModelType) => (builder: Knex) => {
  const argMap = (selection?.arguments || []).reduce((argAcc: { [key: string]: unknown }, { name, value }) => {
    if (name.value === 'conditions') {
      // TODO this has become a right mess - needs moving down and just skipping here.
      (value as ObjectValueNode).fields.forEach((field) => {
        const namedModifier = model.modifiers && model.modifiers[field.name.value];
        // console.log('WHERE STUDF', field.name.value, field.value.value, JSON.stringify(selection, null, 2))

        // const val = field.value.kind === 'Variable' ? sel

        if (namedModifier) {
          // Should also use andwhere
          namedModifier(builder, (field.value as unknown).value);
        } else {
          // And where to chain with auth modifiers
          builder.andWhere(snakeCase(field.name.value), (field.value as unknown).value);
        }
      });

      return argAcc;
    }

    // eslint-disable-next-line no-param-reassign
    argAcc[name.value] = value.value;

    return argAcc;
  }, {} as { [key: string]: unknown });

  // TODO order could be an array
  const order = argMap.orderBy || defaultOrderBy;
  const direction = argMap.direction || defaultDirection;

  builder.limit(parseInt(argMap.limit, 10) || defaultLimit);
  builder.offset(parseInt(argMap.offset, 10) || defaultOffset);
  builder.orderByRaw(`?? ${direction} NULLS LAST`, [order.toLowerCase()]);
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
    modifiers.push({ [modifierName]: createListModifier(selection, model) });

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

const resolveVarsMutation = (info) => {
  const vars = info.variableValues;

  // This is a massive hack in two ways - 1, using the modifier function to do free recursion,
  // 2 - mutating the info object
  JSON.stringify(info, (key, value) => {
    if (value?.kind === 'Variable') {
      if (vars[value?.name?.value]) {
        // eslint-disable-next-line no-param-reassign
        value.value = vars[value.name.value];
      }
    }
    return value;
  });
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
  const typeArgs: { [key: string]: GraphQLFieldConfigArgumentMap } = {};
  const queryFields: { [key: string]: GraphQLFieldConfig } = {};
  const resolvers = {} as AutoResolvers;
  const defaultAuthModifiers: { [key: string]: () => void } = {};

  Object.values(models).forEach((model: ModelType) => {
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
            // TODO notnullable or not...
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

    // Singular instead of [{}, {}] which would be nicer, because needs to combo with auth filters, this is just easier.
    const conditionType = new GraphQLList(new GraphQLInputObjectType({
      name: conditionTypeName,
      fields: Object.entries(columnFields).reduce((acc, [key, value]) => {
        // TODO - can convert the other objects to things to make other types work
        if (['Int', 'String', 'Enum'].includes(value.type.toString())) {
          acc[key] = value;
        }
        // TODO add modfiers from model.static model.modifiers - what type are they? who cares... just define in schema
        return acc;
      }, {}), // TODO - may want to exclude fields from conditions as they should have DB indexes
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
    defaultAuthModifiers[`auth${typeName}`] = () => {};

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
        // I think best course of action would be to ask him what the limitation is...
        queryBuilder.withGraphFetched(eager);

        const argModifiers = Object.assign({}, ...modifiers);
        queryBuilder.modifiers(argModifiers);
      }

      // TODO try catch ?
      const dbResponse = await queryBuilder;

      return expandConnections(dbResponse);
    };


    const resolveFieldType = async (parent, args, context, info) => {
      // TODO validate args
      const queryBuilder = model.query().first();

      resolveVarsMutation(info);

      queryBuilder.modifiers({ ...defaultAuthModifiers, ...context.authModifiers });
      queryBuilder.modify(`auth${typeName}`);

      const argEntries = args && Object.entries(args);
      // TODO might not need this
      const parentEntries = false; // parent && Object.entries({ id: parent.id });

      const criteria = argEntries && argEntries.length ? argEntries : parentEntries;
      console.log('RESOLVE FIELD', model.tableName, argEntries, parent);
      if (criteria && criteria.length) {
        const scopedArgs = criteria.reduce((acc, [key, value]) => {
          acc[`${model.tableName}.${key}`] = value;
          return acc;
        }, {});
        queryBuilder.where(scopedArgs);
      }

      return loadTree({ queryBuilder, node: info.fieldNodes[0] });
    };

    const resolveListFieldType = async (parent, args, context, info) => {
      const queryBuilder = model.query();

      resolveVarsMutation(info);

      // Add list modifiers to top level query
      queryBuilder.modify(createListModifier(info.fieldNodes[0], model));

      // Add auth modifiers where needed
      queryBuilder.modifiers({ ...defaultAuthModifiers, ...context.authModifiers });
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
