const utils = require('./utils');
const graphqlRoot = require('graphql');

const {
  GraphQLInt, GraphQLList, GraphQLEnumType, GraphQLBoolean, GraphQLObjectType,
} = graphqlRoot;

export const singleTypeArgs = (argNameMap, opt) => [
  basicOperator('=', ''),
];

export const connectionTypeArgs = (argNameMap, opt) => [
  basicOperator('>', argNameMap.gt),
  basicOperator('>=', argNameMap.gte),
  basicOperator('<', argNameMap.lt),
  basicOperator('<=', argNameMap.lte),
  basicOperator('like', argNameMap.like),
  isNull(argNameMap.isNull),
  // whereIn('in', argNameMap.in),
  whereIn('notIn', argNameMap.notIn),
  likeNoCase(argNameMap.likeNoCase),
  orderBy(argNameMap.orderBy, 'asc', opt.typeCache),
  orderBy(argNameMap.orderByDesc, 'desc', opt.typeCache),
  limit(argNameMap.limit),
  offset(argNameMap.offset),
];

function basicOperator(op, suffix) {
  return (fields, modelClass) => reducePrimitiveFields(fields, modelClass, (args, field, propName, columnName) => {
    args[propName + suffix] = {
      type: field.type,

      query(query, value) {
        query.where(fullCol(columnName, modelClass), op, value);
      },
    };

    return args;
  });
}

function isNull(suffix) {
  return (fields, modelClass) => reducePrimitiveFields(fields, modelClass, (args, field, propName, columnName) => {
    args[propName + suffix] = {
      type: GraphQLBoolean,

      query(query, value) {
        if (value) {
          query.whereNull(fullCol(columnName, modelClass));
        } else {
          query.whereNotNull(fullCol(columnName, modelClass));
        }
      },
    };

    return args;
  });
}

function likeNoCase(suffix) {
  return (fields, modelClass) => reducePrimitiveFields(fields, modelClass, (args, field, propName, columnName) => {
    args[propName + suffix] = {
      type: field.type,

      query(query, value) {
        query.whereRaw('lower(??.??) like ?', [modelClass.tableName, columnName, value.toLowerCase()]);
      },
    };

    return args;
  });
}

function whereIn(method, suffix) {
  return (fields, modelClass) => reducePrimitiveFields(fields, modelClass, (args, field, propName, columnName) => {
    args[propName + suffix] = {
      type: new GraphQLList(field.type),

      query(query, value) {
        query[method](fullCol(columnName, modelClass), value);
      },
    };

    return args;
  });
}

function orderBy(argName, direction, typeCache) {
  return (fields, modelClass) => {
    const args = {};
    const modelClassTypeName = utils.typeNameForModel(modelClass);
    const typeName = `${modelClassTypeName}PropertiesEnum`;

    if (!typeCache[typeName]) {
      typeCache[typeName] = new GraphQLEnumType({
        name: typeName,
        values: reducePrimitiveFields(fields, modelClass, (values, field, propName) => {
          values[propName] = { value: propName };
          return values;
        }),
      });
    }

    args[argName] = {
      type: typeCache[typeName],

      query(query, value) {
        // If variables are used, the value may already be parsed.
        if (!isFullCol(value)) {
          value = typeCache[typeName].parseValue(value);
        }

        query.orderBy(fullCol(modelClass.propertyNameToColumnName(value), modelClass), direction);
      },
    };

    return args;
  };
}

function range(argName) {
  return () => {
    const args = {};

    args[argName] = {
      type: new GraphQLList(GraphQLInt),

      query(query, values) {
        const start = parseInt(values[0]);
        const end = parseInt(values[1]);
        query.offset(start).limit((end - start) + 1);
      },
    };

    return args;
  };
}

function limit(argName) {
  return () => {
    const args = {};

    args[argName] = {
      type: GraphQLInt, // TODO this was wrapped in new GraphQLList(

      query(query, value) {
        const number = parseInt(value);
        query.limit(number);
      },
    };

    return args;
  };
}

function offset(argName) {
  return () => {
    const args = {};

    args[argName] = {
      type: GraphQLInt, // TODO why this was wrapped in new GraphQLList(

      query(query, value) {
        const number = parseInt(value);
        query.offset(number);
      },
    };

    return args;
  };
}

function reducePrimitiveFields(fields, modelClass, func) {
  const propNames = Object.keys(fields);
  let output = {};

  for (let i = 0, l = propNames.length; i < l; i += 1) {
    const propName = propNames[i];
    const field = fields[propName];

    if (field.type instanceof GraphQLObjectType || field.type instanceof GraphQLList) {
      continue;
    }

    output = func(output, field, propName, modelClass.propertyNameToColumnName(propName));
  }

  return output;
}

function fullCol(columnName, modelClass) {
  return `${modelClass.tableName}.${columnName}`;
}

function isFullCol(value) {
  return value && value.indexOf('.') !== -1;
}
