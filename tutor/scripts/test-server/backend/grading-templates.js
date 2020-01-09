const Factory = require('object-factory-bot');
const { times } = require('lodash');
require('../../../specs/factories/grading-template');

let ROLE = 'teacher';

const COUNT = 2;

module.exports = {

  setRole(role) {
    ROLE = role;
  },

  handler(req, res) {
    return res.json({
      total_count: COUNT,
      items: times(COUNT, (i) => Factory.create('GradingTemplate', {
        task_plan_type: i ? 'reading' : 'homework',
      })),
    });
  },

};
