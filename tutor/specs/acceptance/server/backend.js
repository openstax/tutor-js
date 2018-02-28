const path = require('path');
const jsonServer = require('json-server');
const fs = require('fs-extra');
const chalk = require('chalk');
const { fe_port, be_port } = require('./ports');
const server = jsonServer.create();

const DIR = require('../helpers/working-directory');
const DB = path.join(DIR, 'backend/db.json');
fs.copySync(path.join(__dirname, './backend/db.json'), DB);
// console.log(chalk.green(`Starting api server on port ${be_port}; DB: ${DB}`));

const router = jsonServer.router(DB);
const middlewares = jsonServer.defaults();
const log = require('./log');

let role = 'teacher';

server.use(middlewares);
const HANDLERS = {
  '/api/bootstrap': require('./backend/bootstrap'),
  '/api/offerings': require('./backend/offerings'),
};

// routes that have custom logic
for (let route in HANDLERS) {
  server.get(route, HANDLERS[route].handler);
}

server.use(jsonServer.rewriter({
  '/api/user/ui_settings': '/ui-settings',
  '/api/log/entry': '/log',
  '/api/log/event/onboarding/:id': '/onboarding',
  '/api/:key': '/:key',
}));
server.use(router);


server.listen(be_port, () => {
  log('READY', true);
});

process.on('message', (msg) => {
  if (msg.role) {
    for (let route in HANDLERS) {
      HANDLERS[route].setRole(msg.role);
    }
  }
});
