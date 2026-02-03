import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";

const ROOT_DIR_PATH = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: "./src/index.js",
  mode: "development",
  devtool: 'inline-source-map',
  output: { path: path.resolve(ROOT_DIR_PATH, "dist") },
  devServer: {
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              sourceType: "module",
              presets: [["@babel/preset-env"]],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      lib: path.resolve(ROOT_DIR_PATH, "lib"),
      src: path.resolve(ROOT_DIR_PATH, "src"),
    },
    extensions: [".js", ".css"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
};
