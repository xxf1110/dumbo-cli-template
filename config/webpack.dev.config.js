const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const apiMocker = require('mocker-api');
const { resolve } = require('path')
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


module.exports = merge(baseConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-source-map', //开发环境下使用 cheap-module-eval-source-map
    plugins: [
        new webpack.DefinePlugin({ // 定义环境变量
            DEV: JSON.stringify('dev'), //字符串 DEV === 'dev' 开发环境
            FLAG: 'true' //FLAG 是个布尔类型
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsWebpackPlugin(),
    ],
    devServer: {
        port: 3000,
        quiet: true,
        inline: true,
        stats: "errors-only",
        overlay: false,
        clientLogLevel: "silent",
        compress: true,
        hot: true,
        proxy: {
            "/api": {
                target: "http://localhost:4000",
                pathRewrite: {
                    '/api': ''
                }
            }
        },
        before(app) {
            apiMocker(app, resolve(__dirname, '../mock/mocker.js'))
        }
    },
})