const Factory = require('object-factory-bot');
require('../../../specs/factories/teacher-task-plan');
const { times, merge } = require('lodash');
const { now } = require('../time-now');
const fake = require('faker');
let ROLE = 'teacher';

let PAST = {
  total_count: 5,
  items: times(5, (i) => Factory.create('TeacherTaskPlan',
    { now, days_ago: 100 + (i*5) }
  )),
};

let PLANS = {};

const planForId = (id) => PLANS[id] || (PLANS[id] = Factory.create('TeacherTaskPlan', {
  id,
  type: fake.random.arrayElement(['reading', 'homework']),
}));


module.exports = {
//  'courses/:courseId/plans*': require('./backend/previous-plans'),

  setRole(role) {
    ROLE = role;
  },

  getPast(req, res) {
    return res.json(PAST);
  },

  get(req, res) {
    return res.json(planForId(req.params.id));
  },

  update(req, res) {
    const plan = req.params.id ? planForId(req.params.id) : Factory.create('TeacherTaskPlan', req.body);
    merge(plan, req.body);
    PLANS[plan.id] = plan;
    return res.json(plan);

    //const tmpl = TEMPLATES_MAP[parseInt(req.params.id)];

  },

  route(server) {
    server.get('/api/plans/:id', this.get);
    server.get('/api/courses/:courseId/plans/past*', this.getPast);
    server.patch('/api/plans/:id', this.update);
    server.post('/api/courses/:courseId/plans', this.update);
  },
};
