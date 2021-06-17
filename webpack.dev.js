const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
    },
    plugins: [

        new CopyWebpackPlugin({
            patterns: [
                {from: "src/fanart", to: "fanart"},
                {from: "src/assets/images/fanart", to: "fanart"},
                {from: "src/assets/images/pond/Subapond_vibrantHD-min.jpg", to: "fanart/Subapond_vibrantHD-min.jpg"},
            ],
        }),


    ],
});
