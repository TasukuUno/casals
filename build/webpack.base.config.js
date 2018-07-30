const path = require('path');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJSON = require('../package.json');

const isDarwin = process.platform === 'darwin';

const translateEnvToMode = (env) => {
  if (env === 'production') {
    return 'production';
  }
  return 'development';
};

module.exports = (env) => {
  return {
    target: 'electron-renderer',
    mode: translateEnvToMode(env),
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`),
      },
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: [
            /\.png$/,
            /\.jpg$/,
            /\.webp$/,
            /\.gif$/,
            /\.ttf$/,
          ],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'stats/[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader',
        },
      ],
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({clearConsole: env === 'development'}),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/renderer/index.pug',
        templateParameters: {
          packageJSON,
          isDarwin,
        },
        inject: false,
      }),
    ],
  };
};
