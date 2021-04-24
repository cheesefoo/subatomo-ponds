const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        contentBase: './dist',
    },
    entry: {
        main: './src/index.js',
        phaser: ['phaser'],
        editor: './src/editor/editor.js',
        fabric: ['fabric'],
        // modernizr:['modernizr']
        // dropzone: ['dropzone']

    },
    output: {
        filename: '[name].bundle.js',
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
        /*    new HtmlWebpackPlugin(),*/
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'index.html'),
                    to: path.resolve(__dirname, 'dist')
                },
                {from: "src/assets/images", to: "images"},
                {from: "src/assets/css/upload.css", to: "upload/css/upload.css"},
                {from: "src/assets/css/editor.css", to: "editor/css/editor.css"},
                {from: "src/assets/css/style.css", to: "css/style.css"},
                {from: "manifest.webmanifest", to: "manifest.webmanifest"},
                {from: "src/Form Submission/upload.html", to: "upload/upload.html"},
                {from: "src/editor/editor.html", to: "editor.html"},
                {from: "src/assets/Duck Templates Resized/The Strut resized/200x200/Ducks concept walk idle.png", to: "assets/template200x200.png"}
                // {from: "src/editor/editor.js", to: "editor/editor.js"}
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
