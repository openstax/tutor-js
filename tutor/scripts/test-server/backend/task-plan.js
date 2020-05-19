const Factory = require('object-factory-bot');
require('../../../specs/factories/book');
require('../../../specs/factories/teacher-task-plan');

module.exports = {

  setRole() { },

  handler(req, res) {
    return res.json(Factory.create('TeacherTaskPlan'));
  },

};
