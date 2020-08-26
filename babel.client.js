const common = require('./babel.common');

module.exports = {
  ...common,
  presets: [
    ...common.presets,
    '@babel/preset-env',
    '@babel/preset-react',
  ],
};
