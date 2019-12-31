const Factory = require('object-factory-bot');
require('../../../specs/factories/student-task');
require ('../../../specs/factories/research_survey');
const { times, pick, clone, find } = require('lodash');
const { data: bootstrapData } = require('./bootstrap');
const { now } = require('../time-now');

let survey = Factory.create('ResearchSurvey');

const tasks = {
  teacher: times(25, (i) => Factory.create('TeacherTaskPlan',
    { now, days_ago: i-10 }
  )),
  student: times(25, (i) => Factory.create('StudentDashboardTask',
    { now, days_ago: i-10 }
  )),
};

let ROLE = 'teacher';

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
      data.tasks = tasks.student;
    } else {
      let days = -50;
      data.plans = tasks.teacher;
      data.plans.forEach(plan => {
        plan.tasking_plans = course.periods.map(period =>
          Factory.create('TeacherTaskPlan', { now, period, days_ago: (days+=1) }),
        );
      });
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
