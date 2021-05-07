/* eslint-disable no-console */
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const http = require('http');
const argv = require('yargs').argv;
const config = require('../../../webpack.config.js');

process.env['OX_PROJECT'] = 'tutor';
process.env['NODE_ENV'] = 'development';
process.env['DEV_PORT'] = config.devServer.port;

const notify_port = parseInt(argv['notify-port'] || 8002);

function WebpackDriverStatusPlugin() { }

WebpackDriverStatusPlugin.prototype.apply = function(compiler) {

    compiler.hooks['compile'].tap('WebPackDriver', function() {
        console.log('compiling webpack');
    });

    compiler.hooks['done'].tap('WebPackDriver', function(stats) {
        if (stats.compilation.errors && stats.compilation.errors.length){
            for(let i = 0; i < stats.compilation.errors.length; i++){
                const err = stats.compilation.errors[i];
                console.log('error', {
                    name: err.name, message: err.message,
                    resource: err.module ? err.module.resource : '',
                });
            }
            console.log('FAILED');
        } else {
            // create a fake server just to open a port so the jest knows we're ready
            const listener = http.createServer(function (req, res) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('ok\n');
            }).listen(notify_port, 'localhost', () => {});
            setTimeout(() => { listener.close(() =>{}) }, 5000)
            console.log(`READY, opened notification port: ${notify_port}`)
        }
    });
};

config.plugins = (config.plugins || []);

config.plugins.push(
    new WebpackDriverStatusPlugin()
);

const server = new WebpackDevServer(webpack(config), config.devServer);

server.listen(process.env['DEV_PORT'], 'localhost');
