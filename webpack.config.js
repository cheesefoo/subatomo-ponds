const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./dist",
  },
  entry: {
    main: "./src/index.js",
    vendor: ["phaser"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    // assetModuleFilename: 'assets/[hash][ext][query]',
    assetModuleFilename: "assets/[name][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        type: "asset/source",
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(mp3|opus|wav)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    /*    new HtmlWebpackPlugin(),*/
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "index.html"),
          to: path.resolve(__dirname, "dist"),
        },
        { from: "src/assets/images", to: "images" },
        { from: "src/assets/css", to: "css" },
        { from: "manifest.webmanifest", to: "manifest.webmanifest" },
        { from: "sw.js", to: "sw.js" },
        { from: "favicon.ico", to: "favicon.ico" },
        // { from: "src/Form Submission/upload.html", to: "upload/upload.html" },
        // { from: "src/assets/upload.html", to: "upload/upload.html" },
        /*                {
                                    from: './src/!*',
                                    to: path.resolve(__dirname, 'dist')
                                }*/
      ],
    }),

    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    /*        new webpack.optimize.CommonsChunkPlugin({
                    name: 'production-dependencies',
                    filename: 'production-dependencies.bundle.js'
                })*/
  ],
};
