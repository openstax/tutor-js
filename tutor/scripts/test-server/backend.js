const path = require('path');
const jsonServer = require('json-server');
const fs = require('fs-extra');
const faker = require('faker');
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

server.use(middlewares);
const HANDLERS = {
  bootstrap: require('./backend/bootstrap'),
  offerings: require('./backend/offerings'),
  'courses/:courseId/grading_templates': require('./backend/grading-templates'),
  'courses/:courseId/dashboard': require('./backend/dashboard'),
  'courses/:courseId/plans*': require('./backend/previous-plans'),
  'courses/:courseId/guide': require('./backend/performance-forecast'),
};

// routes that have custom logic
for (let route in HANDLERS) {
  server.get(`/api/${route}`, HANDLERS[route].handler);
}

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
    for (let route in HANDLERS) {
      HANDLERS[route].setRole(msg.role);
    }
  }
});
