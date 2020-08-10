const Factory = require('object-factory-bot');
const { getCourse } = require('./bootstrap');
require('../../../specs/factories/scores');

module.exports = {

  setRole() {},

  handler(req, res) {
    const course = getCourse(req.params.courseId);
    const noAssignments = course.id == '5' ? true : false;
    const scores = course.periods.map(
      period => noAssignments 
        ? Factory.create('NoAssignmentsScoresForPeriod', { period })
        : Factory.create('ScoresForPeriod', { period }),
    );
    return res.json(scores);
  },

};
