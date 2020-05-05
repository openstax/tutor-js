const Factory = require('object-factory-bot');
const moment = require('moment');
const { times, merge } = require('lodash');
const { now } = require('../time-now');
const fake = require('faker');
const { getExercise } = require('./exercises');
const { getCourse } = require('./bootstrap');
require('../../../specs/factories/student-tasks');


let TASKS = {};

const WRM_ID = 3;

// create a WRM task
TASKS[WRM_ID] = Factory.create('StudentTask', { id: WRM_ID, type: 'homework', wrm: true, stepCount: 10 });

const taskForId = (id, attrs = {}) => (
  TASKS[id] || (TASKS[id] = Factory.create('StudentTask', Object.assign(attrs, {
    id,
    wrm: WRM_ID == id,
    type: attrs['type'] || fake.random.arrayElement(['reading', 'homework']),
  })))
);

const getTaskStep = (taskId, stepId) => {
  const task = taskForId(taskId);
  return task.steps.find(ts => ts.id == stepId);
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
    const taskId = parseInt(req.query.task_id);
    const step = getTaskStep(taskId, req.params.id);
    if (!step.content) {
      const factory = step.type == 'exercise' ? 'StudentTaskExerciseStepContent' : 'StudentTaskReadingStepContent';
      Object.assign(step, Factory.create(factory, { ...step, wrm: taskId == WRM_ID }));
    }
    return res.json(step); // { ...step, content: {} });
  },

  saveStep(req, res) {
    const step = getTaskStep(req.query.task_id, req.params.id);
    Object.assign(step, req.body);
    return res.json(step);
  },

  route(server) {
    server.get('/api/tasks/:id', this.getTask);
    server.get('/api/steps/:id', this.getStep);
    server.patch('/api/steps/:id', this.saveStep);
  },
};
