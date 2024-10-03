const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dist = path.resolve(__dirname, "dist");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { marked } = require("marked");
const frontMatter = require("front-matter");
const fs = require("fs");
const template = require("lodash/template");
const camelCase = require("lodash/camelCase");
const fromPairs = require("lodash/fromPairs");
const Dotenv = require("dotenv-webpack");


const appConfig = {
  entry: "./js/index.ts",
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      template: "html/index.html",
      root: path.resolve(__dirname, "."),
    }),
    new MiniCssExtractPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "../mandelbrot"),
      outDir: path.resolve(__dirname, "pkg")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "css/" },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        use: [{ loader: "file-loader?name=./static/[name].[ext]" }],
      },
      {
        test: /\.(webmanifest|xml|toml)$/i,
        use: [{ loader: "file-loader?name=./[name].[ext]" }],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: { path: dist, filename: "app.js" },
  experiments: { syncWebAssembly: true },
  devtool: "source-map",
};

const workerConfig = {
  entry: "./js/worker.js",
  target: "webworker",
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "../mandelbrot"),
      outDir: path.resolve(__dirname, "pkg")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "css/" },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".wasm"],
  },
  output: { path: dist, filename: "worker.js" },
  experiments: { syncWebAssembly: true },
  devtool: "source-map",
};

module.exports = [appConfig, workerConfig];
