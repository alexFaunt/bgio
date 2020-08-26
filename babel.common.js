module.exports = {
  presets: [
    '@babel/typescript',
  ],
  plugins: [
    ['babel-plugin-module-resolver', {
      root: ['./src'],
      extensions: ['.js', '.ts', 'tsx'],
    }],
    ['babel-plugin-styled-components', { displayName: true }],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
  ],
  ignore: [
    'node_modules',
  ],
};
