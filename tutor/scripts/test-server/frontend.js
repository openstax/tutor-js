const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const http = require('http');
const log = require('./log');
const { fe_port, be_port } = require('./ports');

process.env['OX_PROJECT'] = 'tutor';
process.env['NODE_ENV'] = 'development';
process.env['DEV_PORT'] = fe_port;

const config = require('../../../webpack.config.js');

function WebpackDriverStatusPlugin() { }

WebpackDriverStatusPlugin.prototype.apply = function(compiler) {

    compiler.hooks['compile'].tap('WebPackDriver', function() {
        log('status', 'compiling');
    });

    compiler.hooks['done'].tap('WebPackDriver', function(stats) {
        if (stats.compilation.errors && stats.compilation.errors.length){
            log('status', 'invalid');
            for(let i = 0; i < stats.compilation.errors.length; i++){
                const err = stats.compilation.errors[i];
                log('error', {
                    name: err.name, message: err.message,
                    resource: err.module ? err.module.resource : '',
                });
            }
            log('FAILED', true);
        } else {
            // create a fake server just to open a port so the jest knows we're ready
            const listener = http.createServer(function (req, res) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('ok\n');
            }).listen(fe_port + 2, 'localhost', () => {});
            setTimeout(() => { listener.close(() =>{}) }, 5000)
            log('READY', true);
        }
    });
};

config.plugins = (config.plugins || []);

config.plugins.push(
    new WebpackDriverStatusPlugin()
);
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': { 'BACKEND_SERVER_URL': JSON.stringify(`http://localhost:${be_port}/api`) },
    })
);

const server = new WebpackDevServer(webpack(config), config.devServer);

server.listen(fe_port, 'localhost');
