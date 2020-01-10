const Factory = require('object-factory-bot');
const { times, fromPairs } = require('lodash');
require('../../../specs/factories/grading-template');

const TEMPLATES = times(2, (i) => Factory.create('GradingTemplate', {
  task_plan_type: i ? 'reading' : 'homework',
}));

const TEMPLATES_MAP = fromPairs(TEMPLATES.map(t => [t.id, t]))

module.exports = {

  setRole() { }, // do nothing, this is always teacher

  get(req, res) {
    return res.json({ total_count: TEMPLATES.length, items: TEMPLATES });
  },

  patch(req, res) {

    const tmpl = TEMPLATES_MAP[parseInt(req.params.id)];
    if (!tmpl) {
      return res.status(404).end('error');
    }
    Object.assign(tmpl, req.body);
    return res.json(tmpl);
  },

  route(server) {
    server.get('/api/courses/:courseId/grading_templates', this.get);
    server.patch('/api/grading_templates/:id', this.patch);
  },
};
