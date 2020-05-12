const webpack = require('webpack')
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development' 




module.exports = {
    entry: {
        index: resolve(__dirname, '../src/index.js')
    },
    output: {
        path: resolve(__dirname, '../dist'),
        filename: "js/[name].[hash:6].js",
        publicPath: '/', // 通常是cdn地址 
        // chunkFilename: 'js/[name].[hash:6].chunk.js',
    },
    resolve: {
        modules: ['../src/components', 'node_modules'],
        extensions: ['.js', '.jsx'],
        mainFields: ['style', 'main'],
        alias: {
            '@': resolve(__dirname, '../src'),
            '~': resolve(__dirname, '../src/containers'),
            'static': resolve(__dirname, '../static'),
        }
    },
    externals: {
        //jquery通过script引入之后，全局中即有了 jQuery 变量
        // 'jquery': 'jQuery'
    },
    optimization: {
        splitChunks: {//分割代码块
            cacheGroups: {
                vendor: {
                    //第三方依赖
                    priority: 1, //设置优先级，首先抽离第三方模块
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 1 //最少引入了1次
                },
                //缓存组
                common: {
                    //公共模块
                    chunks: 'initial',
                    name: 'common',
                    minSize: 100, //大小超过100个字节
                    minChunks: 3 //最少引入了3次
                }
            }
        }
    },
    module: {
        noParse: /jquery|lodash/,
        rules: [
            {
                test: /\.js|jsx$/,
                use: [
                    'thread-loader',
                    'cache-loader', 
                    'babel-loader', 
                    "eslint-loader",
                ],
                include: [resolve(__dirname, '../src')],
            },
            {
                test: /\.(sc|c)ss$/,
                use: [  
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: { 
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        "overrideBrowserslist": [
                                            ">0.25%",
                                            "not dead"
                                        ]
                                    })
                                ]
                            }
                        }
                    }, 
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [resolve(__dirname, '../src/styles/common.scss')]
                        },
                    },
                ], 
            },
            {
                test: /\.(le|c)ss$/,
                use: [  
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: { 
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        "overrideBrowserslist": [
                                            ">0.25%",
                                            "not dead"
                                        ]
                                    })
                                ]
                            }
                        }
                    }, 
                    'less-loader', 
                ], 
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,  
                            esModule: false,
                            name: '[name]_[hash:6].[ext]',
                            outputPath: 'static'
                        }
                    }
                ], 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: false, // 是否删除双引号
                collapseWitespace: false, // 是否折叠空白
            },
            hash: true, //是否加上hash，默认是 false 
            chunks: ['index']
        }),  
        new CopyWebpackPlugin([
            {
                from: 'public/js/*.js',
                to: resolve(__dirname, 'dist', 'js'),
                flatten: true,
            },
            {
                from: resolve(__dirname, '../static'),
                to: resolve(__dirname, '../dist', 'static'),
            }
        ]),
        new webpack.ProvidePlugin({
            React: 'react',
            Component: ['react', 'Component']
        }),
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : 'css/[name].[hash:6].css',
            //publicPath: './'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath 
        }),
        
    ],

}