const Factory = require('object-factory-bot');
const moment = require('moment');
const { times, merge } = require('lodash');
const { now } = require('../time-now');
const fake = require('faker');
const { getExercise } = require('./exercises');
const { getCourse } = require('./bootstrap');
require('../../../specs/factories/teacher-task-plan');
require('../../../specs/factories/task-plan-stats');
require('../../../specs/factories/task-scores');
require('../../../specs/factories/exercise');

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
    const course = getCourse(req.query.course_id);
    return res.json(planForId(req.params.id, {
      course,
      now: moment().add(fake.random.number() + 10, 'days'),
    }));
  },

  getStats(req, res) {
    const course = getCourse(req.query.course_id);
    const plan = planForId(req.params.id);
    const exercises = times(4).map(() => Factory.create('TutorExercise'));

    const stat = Factory.create('TaskPlanStat', { task_plan: plan, course, exercises });
    res.json(stat);
  },

  getScores(req, res) {
    const course = getCourse(req.query.course_id);
    const plan = planForId(req.params.id);
    const exercises = times(8).map((id) => getExercise(id));
    const scores = Factory.create('TaskPlanScores', { task_plan: plan, course, exercises });
    res.json(scores);
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
    server.get('/api/plans/:id/scores', this.getScores);
    server.get('/api/plans/:id/stats', this.getStats);
    server.get('/api/plans/:id/review', this.getStats);
    server.post('/api/courses/:courseId/plans', this.update);
  },
};
