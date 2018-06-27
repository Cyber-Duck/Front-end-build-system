const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: './public/js/src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/js/min')
    },
    plugins: {
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                loader: "sass-loader", options: {
                    sourceMap: true
                }
            }]
        }]
    }
};