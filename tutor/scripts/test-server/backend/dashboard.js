const Factory = require('object-factory-bot');
require('../../../specs/factories/student-tasks');
require ('../../../specs/factories/research_survey');
const { range, pick, clone, omit, find } = require('lodash');
const { data: bootstrapData } = require('./bootstrap');
const { now } = require('../time-now');
let survey = Factory.create('ResearchSurvey');

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
            data.tasks = range(1, 25).map(id => omit(Factory.create('StudentDashboardTask', {
                now, days_ago: id-10,
            }), 'course'));
        } else {
            let days = -50;

            const defaultPlans = range(1, 25).map(id => omit(Factory.create('TeacherTaskPlan', {
                id, course, now,
                days_ago: (days+=id),
            }), 'course'));

            // Match due_at day offset to render day before + day after current day
            const planSettings = [
                { id: 26, type: 'homework', days_ago: 4 },
                { id: 27, type: 'homework', days_ago: 2 },
                { id: 28, type: 'event',    days_ago: 2 },
                { id: 29, type: 'external', days_ago: 2 },
                { id: 30, type: 'reading',  days_ago: 2 },
            ];

            const setPlans = planSettings.map(s => Factory.create('TeacherTaskPlan', {
                ...s, course, now,
            }));

            data.plans = [...defaultPlans, ...setPlans];

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

        return res.json(data);
    },

};
