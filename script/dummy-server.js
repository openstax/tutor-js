const WebpackDevServer = require("webpack-dev-server");
const webpack = require('webpack');
const fs = require('fs');
var spawn = require('child_process').spawn;

process.env['OX_PROJECT'] = 'tutor';
process.env['NODE_ENV'] = 'development';

const config = require('../webpack.config.js');
const PORT = process.env.PORT || 8000;

const role = process.argv[2];

"use strict";
if (-1 == ['student', 'teacher'].indexOf(role)) {
  console.log("Usage: " + __filename + " <student|teacher>");
  process.exit(-1);
}

//console.log(`Role: ${role}`);



function log(type, value) {
  const msg = { [`${type}`]: value };
  if (process.send) {
    process.send(msg);
  } else {
    console.log('STATUS:', JSON.stringify(msg));
  }
}


// const tmpPath = '/Users/nas/code/ox/tmp';
//
// const jsonServer = spawn('node_modules/.bin/json-server', [
//   '--port', 3001, `tutor/api/${role}.db.json`
// ]);
//
// jsonServer.stdout.on('data', (data) => {
//   console.log(`JSON: ${data}`);
// });
//

function WebpackDriverStatusPlugin() { }

WebpackDriverStatusPlugin.prototype.apply = function(compiler) {

  compiler.plugin('compile', function() {
    log('status', 'compiling');
  });

  compiler.plugin('invalid', function() {
    log('status', 'invalid');
  });

  compiler.plugin('failed-module', function(module) {
    log('failed-module', module);
  });
  compiler.plugin('done', function(stats) {
    if (stats.compilation.errors && stats.compilation.errors.length){
      log('status', 'invalid');
      for(var i = 0; i < stats.compilation.errors.length; i++){
        var err = stats.compilation.errors[i];
        log('error', {
          name: err.name, message: err.message,
          resource: err.module ? err.module.resource : '',
        });
      }
    } else {
      log('status', 'success');
    }
  });
};

config.plugins = (config.plugins || []);

config.plugins.push(
  new WebpackDriverStatusPlugin()
);

console.dir(config)

const front_server = new WebpackDevServer(webpack(config), config.devServer);


front_server.listen(PORT, 'localhost');
