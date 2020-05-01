const Factory = require('object-factory-bot');
const moment = require('moment');
const { times, merge } = require('lodash');
const { now } = require('../time-now');
const fake = require('faker');
const { getExercise } = require('./exercises');
const { getCourse } = require('./bootstrap');
require('../../../specs/factories/student-tasks');


let TASKS = {};

const taskForId = (id, attrs = {}) => (
  TASKS[id] || (TASKS[id] = Factory.create('StudentTask', Object.assign(attrs, {
    id,
    type: attrs['type'] || fake.random.arrayElement(['reading', 'homework']),
  })))
);

const getStep = (taskId, stepId) => {
  const task = taskForId(taskId);
  const step=task.steps.find(ts => ts.id == stepId);
  const factory = step.type == 'exercise' ? 'StudentTaskExerciseStepContent' : 'StudentTaskReadingStepContent';
  Object.assign(step, Factory.create(factory, step));
  return step;
};


module.exports = {

  setRole() { }, // no effect

  getTask(req, res) {
    const course = getCourse(req.query.course_id);
    return res.json(taskForId(req.params.id, {
      course,
      now: moment().add(fake.random.number() + 10, 'days'),
    }));
  },

  getStep(req, res) {
    return res.json(
      getStep(req.query.task_id, req.params.id)
    );
  },

  saveStep(req, res) {
    const step = getStep(req.query.task_id, req.params.id);
    Object.assign(step, req.body);
    return res.json(step);
  },

  route(server) {
    server.get('/api/tasks/:id', this.getTask);
    server.get('/api/steps/:id', this.getStep);
    server.patch('/api/steps/:id', this.saveStep);
  },
};
