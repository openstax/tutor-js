const Factory = require('object-factory-bot');
require('../../../specs/factories/student-task');
require ('../../../specs/factories/research_survey');
const { times, range, pick, clone, omit, find } = require('lodash');
const { data: bootstrapData } = require('./bootstrap');
const { now } = require('../time-now');
const fake = require('faker');
let survey = Factory.create('ResearchSurvey');

let ROLE = 'teacher';

const TITLES = times(50, () => fake.company.bs());

module.exports = {

  setRole(role) {
    ROLE = role;
  },

  handler(req, res) {
    const course = find(bootstrapData[ROLE].courses, { id: parseInt(req.params.courseId) });
    if (!course) {
      return res.status(404).send('Not found');
    }
    const data = { };

    if (ROLE === 'student') {
      data.tasks = range(1, 25).map(id => omit(Factory.create('StudentDashboardTask', {
        now, days_ago: id-10,
        title: TITLES[id],
      }), 'course'));
    } else {
      let days = -50;

      data.plans = range(1, 25).map(id => omit(Factory.create('TeacherTaskPlan', {
        id, course, now,
        title: TITLES[id],
        days_ago: (days+=id),
      }), 'course'));

      data.tasks = [];
    }

    data.role = clone(course.roles[0]);
    data.course = {
      name: course.name,
      teachers: pick(data.user, 'id', 'name', 'first_name', 'last_name'),
    };
    if (ROLE=='student') {
      data.research_surveys = [ survey ];
    }
    res.json(data);
  },

};
