const path = require("path")
const devServerConfig = require("./devServerConfig")
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// MiniCssExtractPlugin.loader 提取css 为单独问文件
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");//压缩js
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require("webpack")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");//压缩图片
const WebpackBar = require('webpackbar')
// const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
// const Components = require('unplugin-vue-components/webpack')
// import ElementPlus from 'unplugin-element-plus/webpack'
// const WorkboxPlugin = require('workbox-webpack-plugin');


const iSProduction = process.env.NODE_ENV === 'production';

//返回处理样式lodaer函数
const getStyleLoaders = (preload) => {
    return [
        iSProduction ? MiniCssExtractPlugin.loader : "vue-style-loader",
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
        preload && {
            loader: preload,
            options: preload === "less-loader" ? {
                //自定义主题色0
                lessOptions: {
                    modifyVars: { '@primary-color': '#1DA57A' },
                    javascriptEnabled: true,
                },
            } : {}
        },
        preload && {
            loader: preload,
            options: preload === "sass-loader" ? {
                //自定义主题色0
                // additionalData: `@use "@/styles/element/index.scss" as *;`,
            } : {}
        },
        preload === "sass-loader" ? {
            loader: 'style-resources-loader',
            options: {
                patterns: [
                    path.resolve(__dirname, "../src/styles/variables.scss")
                ]
            }
        } : false

    ].filter(Boolean);
}
module.exports = {
    entry: "./src/main.js",
    output: {
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean: true,
    },
    devServer: devServerConfig,
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
                    // iSProduction?
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
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
        new WebpackBar(
            // {
            //     start(context) {
            //       // Called when (re)compile is started
            //     },
            //     change(context) {
            //       // Called when a file changed on watch mode
            //     },
            //     update(context) {
            //       // Called after each progress update
            //     },
            //     done(context) {
            //       // Called when compile finished
            //     },
            //     progress(context) {
            //       // Called when build progress updated
            //     },
            //     allDone(context) {
            //       // Called when _all_ compiles finished
            //     },
            //     beforeAllDone(context) {
            //     },
            //     afterAllDone(context) {
            //     },
            //    }
        )
        // Components({
        //     resolvers: [ElementPlusResolver()],
        //   }),
        // ElementPlus({
        //     useSource: true,
        // }),
    ],
    optimization: {
        //代码分割配置 
        splitChunks: {
            chunks: "all", // 其他使用默认值
            cacheGroups: {
                // 抽离打包
                // react react-dom react-router-dom 一起打包生产一个js文件
                // 打包权重要比node_modules 高 才可以优先打包
                vue: {
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name: 'chunk-react',
                    priority: 40,
                },
                // antd 单独打包
                antd: {
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    name: 'chunk-antd',
                    priority: 30,
                },
                elementPlus: {
                    test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                    name: "elementPlus-chunk",
                    priority: 29,
                },
                // 剩下node_moules单独打包
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunk-libs',
                    priority: 20,
                },
            },
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`,
        },
        //minimize是否需要进行压缩 
        minimize: iSProduction,
        minimizer: [
            //压缩css
            new CssMinimizerWebpackPlugin(),
            //压缩js
            new TerserWebpackPlugin(),
            //压缩图片
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    }
                },
            }),
        ]
    },
    // webpack 解析模块加载的选项
    resolve: {
        // 自动补全文件扩展名  其中后一个可以加载就不继续往下看了
        extensions: ['.vue', '.js', 'json'],
        // 路径别名
        alias: {
            "@": path.resolve(__dirname, "../src")
        }
    },
    // css:{
    //     requireModuleExtension: false//去掉 less sass 变量导出必须带module后缀
    // },
    performance: false, // 关闭性能分析，提升打包速度
}