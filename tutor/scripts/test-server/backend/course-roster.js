const Factory = require('object-factory-bot');
const { getCourse } = require('./bootstrap');
const { fe_port, be_port } = require('../ports');
require('../../../specs/factories/course-roster');

module.exports = {
    resetState() {
        // no state, nothing to reset
    },

    setRole() { },   

    route(server) {
        server.get('/api/courses/:courseId/roster', (req, res) => {
            const course = getCourse(req.params.courseId, 'teacher');
            const roster = Factory.create('CourseRoster', { course });
            const [ t ] = roster.teachers
            t.role_id = course.roles.find(r => r.type == 'teacher').id;
            t.is_active = true
            res.json(roster);
        });

        server.delete('/api/teachers/:teacherId', (req, res) => { res.json({}) });
    },

};
