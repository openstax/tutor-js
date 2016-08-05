var KarmaServer = require('karma').Server;

var files = JSON.parse(process.argv[2]);

server = new KarmaServer({
  configFile: __dirname + '/karma-dev.config.coffee',
  files: files,
  singleRun: false
})

server.start()
