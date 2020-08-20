import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';

import config from './src/client/config';

dotenv.config();

const { NODE_ENV, DEV_SERVER_PORT, SERVER_PORT, API_PATH, VERSION } = process.env;

// const { CIRCLE_SHA1, CIRCLE_TAG } = env;
// const version = CIRCLE_TAG || (CIRCLE_SHA1 && CIRCLE_SHA1.substr(0, 7)) || 'dev';

export default {
  entry: path.resolve(__dirname, 'src/client/index.tsx'),
  // node: { global: true },
  target: 'web',
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    port: DEV_SERVER_PORT,
    // compress: true,
    contentBase: [
      path.resolve(__dirname, 'src/public'),
    ],
    historyApiFallback: true,
    host: '0.0.0.0',
    // hot: true,
    https: NODE_ENV !== 'development',
    proxy: {
      [`${API_PATH}`]: {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000,
    },
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
  },
  // optimization: {
  //   moduleIds: 'hashed',
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)/,
        exclude: [/node_modules/, /\.json/],
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/public/index.ejs'),
      templateParameters: {},
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_VERSION': `"${VERSION}"`,
    }),
    new webpack.EnvironmentPlugin(
      Object.keys(config)
        .filter((key) => key !== 'VERSION')
        .reduce((clientConfig, key) => {
          // eslint-disable-next-line no-param-reassign
          clientConfig[`REACT_APP_${key}`] = process.env[key];
          return clientConfig;
        }, {} as any),
    ),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src/public/'),
        to: path.resolve(__dirname, 'build/public/'),
      }],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.json', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.client.json'),
      }),
    ],
  },
  output: {
    filename: '[name]/[fullhash].js',
    publicPath: '/',
  },
};
