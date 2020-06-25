const Factory = require('object-factory-bot');
const { getCourse } = require('./bootstrap');
require('../../../specs/factories/scores');

module.exports = {

  setRole() {},

  handler(req, res) {
    const course = getCourse(req.params.courseId);
    const scores = course.periods.map(
      period => Factory.create('ScoresForPeriod', { period }),
    );
    return res.json(scores);
  },

};
