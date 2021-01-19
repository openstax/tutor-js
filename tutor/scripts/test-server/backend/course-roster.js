const Factory = require('object-factory-bot');
const { getCourse } = require('./bootstrap');
const { fe_port, be_port } = require('../ports');
require('../../../specs/factories/course-roster');

module.exports = {

  setRole() { },

  route(server) {
    server.get('/api/courses/:courseId/roster', (req, res) => {
      const course = getCourse(req.params.courseId);
      const roster = Factory.create('CourseRoster', { course });
      roster.teachers[0].role_id = course.roles.find(r => r.type == 'teacher').id;
      res.json(roster);
    });

    server.delete('/api/teachers/:teacherId', (req, res) => { res.json({}) });
  },

};
