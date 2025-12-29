import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import {fileURLToPath} from 'url';

const ROOT_DIR_PATH = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './index.js',
  mode: 'development',
  output: {path: path.resolve(ROOT_DIR_PATH, 'dist')},
  devServer: {
    port: 3001,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'module',
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: './index.html'}),
  ],
};
