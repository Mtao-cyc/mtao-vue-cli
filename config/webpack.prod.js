const path = require("path")
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// MiniCssExtractPlugin.loader 提取css 为单独问文件
const CopyPlugin = require("copy-webpack-plugin");
// const preloadWebpackPlugin = require('@vue/preload-webpack-plugin'); //
// const WorkboxPlugin = require('workbox-webpack-plugin'); //预加载

module.exports = merge(baseWebpackConfig, {
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "static/js/[name].[contenthash:10].js",
        chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        // dot: true,
                        // gitignore: true,
                        //忽略复制index.html 文件过去
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
    ],
    mode: "production",
    devtool: "source-map",
})