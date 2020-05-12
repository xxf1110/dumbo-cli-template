const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const smp = new SpeedMeasurePlugin();
const { resolve } = require('path')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin'); 


const prodConfig = merge(baseConfig, {
    mode: "production",
    devtool: 'source-map', 
    plugins: [
        new webpack.DefinePlugin({ // 定义环境变量
            DEV: JSON.stringify('production'), //字符串 DEV === 'dev' 开发环境
            FLAG: 'false' //FLAG 是个布尔类型
        }), 
        new OptimizeCssPlugin(),
        new CleanWebpackPlugin(), 
    ]
})

// module.exports = smp.wrap(prodConfig) 
module.exports = {
    ...prodConfig
}