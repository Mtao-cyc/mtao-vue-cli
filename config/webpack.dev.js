const path = require("path")
const {DefinePlugin} =require("webpack")
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const WebpackBar = require('webpackbar')


//返回处理样式lodaer函数
const getStyleLoaders = (preload) => {
    return [
        "vue-style-loader",
        "css-loader",
        {
            //处理css兼容性要配合 package.json中browserslist来指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            'postcss-preset-env',//处理样式兼容性
                            {
                                // 其他选项
                            },
                        ],
                    ],
                },
            },
        },
        preload,
    ].filter(Boolean);
}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query]",
    },
    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true,//解决前端刷新404问题
    },
    module: {
        rules: [
            //处理css
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("sass-loader"),
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders("stylus-loader"),
            },
            //处理图片
            {
                test: /\.(jpe?g|png|fig|webp|svg)/,
                type: "asset",//可以转base64
                parser: {
                    dataUrlCondition: {
                        //小于10kb的图片转换为base64
                        //优点减少请求数量 缺点：提交更大
                        maxSize: 10 * 1024 // 10kb
                    }
                },
            },
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset/resource',//不需要转base64的用asset/resource
            },
            {
                test: /\.(mp3|}mp4|avi|mov)$/,
                type: 'asset/resource',//不需要转的用asset/resource
            },
            {
                test: /\.js?$/,
                // exclude: /(node_modules)/,//排除node_modules中的js文件不处理 其他文件都处理
                include: path.resolve(__dirname, "../src"),//只处理src下的文件
                loader: 'babel-loader',
                options: {
                    // presets: ['@babel/plugin-transform-runtime']
                    cacheDirectory: true,//开启babel 缓存
                    cacheCompression: false,//关闭缓存文件压缩 增加压缩速度
                    // plugins:["@babel/plugin-transform-runtime"],//减少代码体积 react-app 内置了
                    plugins: [

                    ],

                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",//默认值
            cache: true,//开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"), //缓存位置
            // threads,//开启多进程 和进程数量
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        new VueLoaderPlugin(),
        //cross-env 定义的环境变量给打包工具使用的
        // DefinePlugin 定义的变量是给源代码使用的，解决vue3页面警告问题
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false,
        }),
        new WebpackBar(),

    ],
    mode: "development",
    devtool: "cheap-module-source-map",
    optimization: {
        //代码分割配置 
        splitChunks: {
            chunks: "all", // 其他使用默认值
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`,
        }
    },
    // webpack 解析模块加载的选项
    resolve: {
        // 自动补全文件扩展名  其中后一个可以加载就不继续往下看了 
        extensions: ['.vue', '.js', 'json'],
        //路径别名
        alias:{
            "@":path.resolve(__dirname,"../src"),
        }
    },
}