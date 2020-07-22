const Factory = require('object-factory-bot');
const moment = require('moment');
const fake = require('faker');
const { getCourse } = require('./bootstrap');
const tasksPlansApi = require('./task-plans');
require('../../../specs/factories/student-tasks');

const TASKS = {};

const WRM_ID = 3;
const WRM_ID_LATE_NOT_ACCEPTED = 4;

// create a WRM task
TASKS[WRM_ID] = Factory.create('StudentTask', { id: WRM_ID, type: 'homework', wrm: true, stepCount: 10 });
TASKS[WRM_ID_LATE_NOT_ACCEPTED] = Factory.create('StudentTask', 
  { id: WRM_ID_LATE_NOT_ACCEPTED, type: 'homework', wrm: true, stepCount: 10, isLateNotAccepted: true });

const taskForId = (id, attrs = {}) => (
  TASKS[id] || (TASKS[id] = Factory.create('StudentTask', Object.assign(attrs, {
    id,
    wrm: WRM_ID == id,
    type: attrs['type'] || id % 2 == 0 ? 'homework' : 'reading',
  })))
);

const getTaskStep = (taskId, stepId) => {
  const task = taskForId(taskId);
  return task.steps.find(ts => ts.id == stepId);
};


module.exports = {
  WRM_ID,

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

  gradeStep(req, res) {
    tasksPlansApi.setGrade(req.params.id, req.body);
    return res.json(req.body);
  },

  route(server) {
    server.get('/api/tasks/:id', this.getTask);
    server.get('/api/steps/:id', this.getStep);
    server.patch('/api/steps/:id', this.saveStep);
    server.put('/api/steps/:id/grade', this.gradeStep);
  },
};
