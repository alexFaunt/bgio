const common = require('./babel.common');

// Used on the server - can't pass it a config name so it has to just be babel.config.js
module.exports = {
  ...common,
  presets: [
    ...common.presets,
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      }
    }],
  ],
};
