const Factory = require('object-factory-bot');
const moment = require('moment');
const { times, merge, get, isNil } = require('lodash');
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
const SCORES = {};
const GRADES = {};

// TODO: Get OpenEndedTutorExercise to work and use them here.
const SETTINGS = [
  { id: 1, type: 'reading' },
  { id: 2, type: 'homework' },
  { id: 3, type: 'external' },
  { id: 4, type: 'event' },
  { id: 5, type: 'homework', exercises: [] },
  { id: 6, type: 'homework', exercises: [] },
];

const planForId = (id, attrs = {}) => (
  PLANS[id] || (PLANS[id] = Factory.create('TeacherTaskPlan', Object.assign(attrs, {
    id,
    type: findSetting(id, 'type', fake.random.arrayElement(['reading', 'homework'])) ,
  })))
);
const scoresForId = (courseId, planId) => {
  let scores = SCORES[planId];
  if (!scores) {
    const course = getCourse(courseId);
    const plan = planForId(planId, { course: course });
    const exercises = plan.type == 'homework' ? times(8).map((id) => getExercise(id)) : [];
    SCORES[planId] = scores = Factory.create('TaskPlanScores', { task_plan: plan, grades: {}, course, exercises });
  } else {
    scores.tasking_plans.forEach(tp => {
      tp.students.forEach(s => {
        s.questions.forEach(q => {
          const grade = GRADES[q.task_step_id];
          if (grade) {
            Object.assign(q, grade);
            q.needs_grading = isNil(grade.grader_points);
          }
        });
      });
    });
  }
  return scores;
};

function findSetting(id, setting, defaultValue) {
  return get(SETTINGS.find(s => s.id == id), setting, defaultValue);
}

function findOrCreateExercises({ id, count }) {
  return findSetting(id, 'exercises', times(count).map((id) => getExercise(id)));
}

module.exports = {
  setRole(role) {
    ROLE = role;
  },

  setGrade(taskId, grades) {
    GRADES[taskId] = grades;
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
    const scores = scoresForId(req.query.course_id, req.params.id);
    res.json(scores);
  },

  update(req, res) {
    const plan = req.params.id ? planForId(req.params.id) : Factory.create('TeacherTaskPlan', req.body);
    merge(plan, req.body);
    PLANS[plan.id] = plan;
    return res.json(plan);
  },

  delete(req, res) {
    const plan = planForId(req.params.id);
    return res.json(plan);
  },

  route(server) {
    server.get('/api/plans/:id', this.get);
    server.patch('/api/plans/:id', this.update);
    server.delete('/api/plans/:id', this.delete);
    server.get('/api/courses/:courseId/plans/past*', this.getPast);
    server.get('/api/plans/:id/scores', this.getScores);
    server.get('/api/plans/:id/stats', this.getStats);
    server.get('/api/plans/:id/review', this.getStats);
    server.post('/api/courses/:courseId/plans', this.update);
  },
};
