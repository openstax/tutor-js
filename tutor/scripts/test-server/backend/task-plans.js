const Factory = require('object-factory-bot');
const moment = require('moment');
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

const planForId = (id, attrs = {}) => (
  PLANS[id] || (PLANS[id] = Factory.create('TeacherTaskPlan', Object.assign(attrs, {
    id,
    type: fake.random.arrayElement(['reading', 'homework']),
  })))
);


module.exports = {
  setRole(role) {
    ROLE = role;
  },

  getPast(req, res) {
    return res.json(PAST);
  },

  get(req, res) {
    return res.json(planForId(req.params.id, {
      now: moment().add(fake.random.number() + 10, 'days'),
    }));
  },

  update(req, res) {
    const plan = req.params.id ? planForId(req.params.id) : Factory.create('TeacherTaskPlan', req.body);
    merge(plan, req.body);
    PLANS[plan.id] = plan;
    return res.json(plan);
  },

  route(server) {
    server.get('/api/plans/:id', this.get);
    server.get('/api/courses/:courseId/plans/past*', this.getPast);
    server.patch('/api/plans/:id', this.update);
    server.post('/api/courses/:courseId/plans', this.update);
  },
};
