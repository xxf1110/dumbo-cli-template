const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackDevConfig = require('../config/webpack.dev.config');
const net = require('net')
const chalk = require('chalk');



const compiler = webpack(webpackDevConfig);
const devServerOptions = Object.assign({}, webpackDevConfig.devServer, {
  open: true,
});

const server = new WebpackDevServer(compiler, devServerOptions);
const startDevServer = port => {
  server.listen(port, '127.0.0.1', () => {
    console.log(chalk.greenBright(`Starting server on http://localhost:${port}`));
  });
} 


let port = (webpackDevConfig.devServer && webpackDevConfig.devServer.port) ? webpackDevConfig.devServer.port : 8080

const portServer = net.createServer().listen(port) 
portServer.on('listening', function () {
  portServer.close()
  startDevServer(port)
})
portServer.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    port++;
    startDevServer(port)
  }
})

