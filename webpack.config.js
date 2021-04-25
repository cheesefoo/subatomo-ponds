const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


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
        contentBase: './dist',
    },
    entry: {
        main: {import: ['./src/index.js', './src/assets/css/style.css'], dependOn: 'phaser'},
        "upload/upload": ['./src/Form Submission/upload.js', './src/assets/css/upload.css'],
        phaser: ['phaser'],
        // dropzone: ['dropzone']

    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // assetModuleFilename: 'assets/[hash][ext][query]',
        assetModuleFilename: 'assets/[name][ext][query]',

        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: [/\.vert$/, /\.frag$/],
                type: 'asset/source'
            },
            {
                test: /\.(gif|png|jpe?g|svg|xml)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(mp3|opus|wav)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }


        ]
    },
    plugins: [

        new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Upload',
            filename: "upload/upload.html",
            template: 'src/Form Submission/upload.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                // {
                //     from: path.resolve(__dirname, 'index.html'),
                //     to: path.resolve(__dirname, 'dist')
                // },
                {from: "src/assets/images", to: "images"},
                // {from: "src/assets/css/upload.css", to: "upload/css/upload.css"},
                // {from: "src/assets/css/style.css", to: "css/style.css"},
                {from: "manifest.webmanifest", to: "manifest.webmanifest"},
                {from: "sw.js", to: "sw.js"},
                {from: "favicon.ico", to: "favicon.ico"},
                {from: "src/assets/sound", to: "upload"}
                // {from: "src/Form Submission/upload.html", to: "upload/upload.html"}
                /*                {
                                    from: './src/!*',
                                    to: path.resolve(__dirname, 'dist')
                                }*/
            ]
        }),

        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        })
        /*        new webpack.optimize.CommonsChunkPlugin({
                    name: 'production-dependencies',
                    filename: 'production-dependencies.bundle.js'
                })*/
    ]
};
