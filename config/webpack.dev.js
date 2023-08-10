const path = require("path")
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base')

module.exports = merge(baseWebpackConfig, {
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
    }, 
    mode: "development",
    devtool: "cheap-module-source-map",
})