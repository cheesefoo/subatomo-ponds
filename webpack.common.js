const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {

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
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            }
        ],
    },
    plugins: [

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "index.html"),
                    to: path.resolve(__dirname, "dist"),
                },
                {from: "src/assets/localization", to: "localization"},
                {from: "src/info", to: "docs"},
                {from: "src/assets/sound", to: "docs"},
                {from: "src/assets/localization", to: "docs/localization"},
                {from: "src/assets/images/bg1-white.png", to: "docs/bg1-white.png"},
                {from: "src/assets/images/bg1-gr-white.png", to: "docs/bg1-gr-white.png"},
                {from: "src/assets/css", to: "css"},
                {from: "src/assets/fonts", to: "fonts"},
                {from: "manifest.webmanifest", to: "manifest.webmanifest"},
                {from: "sw.js", to: "sw.js"},
                // {from: "src/assets/favicon", to: ""},
                // {from: "src/assets/favicon", to: "docs"},
            ],
        }),

        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
        }),
    ],
};
