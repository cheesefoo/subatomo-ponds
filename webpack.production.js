const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                },
            }),
        ],
        // splitChunks: {
        //     // include all types of chunks
        //     chunks: "all",
        // },
    },
    mode: "production",
});
