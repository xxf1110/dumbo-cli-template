const webpack = require('webpack')
const webpackProdConfig = require('../config/webpack.prod.config');
const merge = require('webpack-merge')
const ora = require('ora');
const chalk = require('chalk');


const spinner = ora(chalk.greenBright('building... 0%'))
spinner.color = 'greenBright';
spinner.start()

 
const handler = (percentage, message, ...args) => {
    spinner.text = chalk.greenBright(`building... ${Math.ceil(percentage * 1000) / 10}%\n`)
    if (percentage === 1) { 
        spinner.clear()
        spinner.stop()
    }
};

const prodConfig = merge(webpackProdConfig, {
    plugins: [
        new webpack.ProgressPlugin(handler)
    ],
})

const compiler = webpack(prodConfig)
compiler.run((err, stats) => {
    if (err) { 
        if (err.details) {
            console.error(err.details);
        }
        return;
    } 
    const info = stats.toJson();
    if (stats.hasErrors()) {
        // console.error(info.errors);
    }
    if (stats.hasWarnings()) {
        // console.warn(info.warnings);
    }
    console.info(stats.toString({ 
        errors: true,
        colors: true,  
        warnings: false,    
        children: false, 
        modules: false,
        entrypoints: false
    }))
    process.exit()
}) 