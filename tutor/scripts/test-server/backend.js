const path = require('path');
const jsonServer = require('json-server');
const fs = require('fs-extra');
const faker = require('faker');
const express = require('express');
const { now } = require('./time-now');
const { fe_port, be_port } = require('./ports');
const server = jsonServer.create();
const os = require('os');

faker.seed(12345);

server.all('/*', function(req, res, next) {
  res.setHeader('X-App-Date', now);
  res.setHeader('Access-Control-Expose-Headers', 'X-App-Date');
  next();  // call next() here to move on to next middleware/router
});


const DB = path.join(os.tmpdir(), 'tutor-test-server/backend/db.json');
fs.copySync(path.join(__dirname, './backend/db.json'), DB);


const router = jsonServer.router(DB);
const middlewares = jsonServer.defaults();
const log = require('./log');
server.use(express.json());
server.use(middlewares);
const GET_HANDLERS = {
  bootstrap: require('./backend/bootstrap'),
  offerings: require('./backend/offerings'),
  'courses/:courseId/dashboard': require('./backend/dashboard'),
  'courses/:courseId/guide': require('./backend/performance-forecast'),
  'ecosystems/:ecoystemId/readings': require('./backend/readings'),
  'ecosystems/:ecosystemId/exercises/homework_core': require('./backend/exercises'),
};

const MULTI_HANDLERS = [
  require('./backend/grading-templates'),
  require('./backend/task-plans'),
];

// routes that have custom logic
for (let route in GET_HANDLERS) {
  server.get(`/api/${route}`, GET_HANDLERS[route].handler);
}
MULTI_HANDLERS.forEach((handler) => {
  handler.route(server);
});

server.use(jsonServer.rewriter({
  '/api/user/ui_settings': '/ui-settings',
  '/api/log/entry': '/log',
  '/api/log/event/onboarding/:id': '/onboarding',
  '/api/user/tours/:id': '/tours',
  '/api/:key': '/:key',
  '/api/courses/:courseId/plans*': '/previousTaskPlans',
}));
server.use(router);


server.listen(be_port, () => {
  log('READY', true);
});

process.on('message', (msg) => {
  if (msg.role) {
    for (let route in GET_HANDLERS) {
      GET_HANDLERS[route].setRole(msg.role);
    }
    MULTI_HANDLERS.forEach((handler) => { handler.setRole(msg.role); });
  }
});
