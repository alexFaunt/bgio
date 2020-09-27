import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import config from './src/client/config';

const env = dotenv.config();
dotenvExpand(env);

const { NODE_ENV, DEV_SERVER_PORT, PORT, API_PATH, VERSION } = env.parsed as { [key: string]: string };

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
    contentBasePublicPath: '/static',
    historyApiFallback: true,
    host: '0.0.0.0',
    // hot: true,
    https: NODE_ENV !== 'development',
    proxy: {
      [`/graphql`]: {
        target: `http://localhost:2001`,
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
        options: {
          configFile: './babel.client.js',
        },
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
          clientConfig[`REACT_APP_${key}`] = env.parsed ? env.parsed[key] : null;
          return clientConfig;
        }, {} as any),
    ),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src/public/'),
        to: path.resolve(__dirname, 'build/client/public/'),
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
    path: path.resolve(__dirname, 'build/client/public'),
    filename: '[name]/[hash].js',
    publicPath: NODE_ENV === 'production' ? '/static' : '/',
  },
};

// Request URL: http://localhost:2000/main/%5Bfullhash%5D.js
