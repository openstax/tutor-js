const Factory = require('object-factory-bot');
const { times, fromPairs } = require('lodash');
require('../../../specs/factories/grading-template');


let TEMPLATES = null
let TEMPLATES_MAP = null

const setDefaultTemplates = () => {
    TEMPLATES = times(2, (i) => Factory.create('GradingTemplate', {
        task_plan_type: i ? 'reading' : 'homework',
    }));
    TEMPLATES.push(Factory.create('GradingTemplate', { task_plan_type: 'homework', name: 'Second Homework' }));
    TEMPLATES_MAP = fromPairs(TEMPLATES.map(t => [t.id, t]));
}

setDefaultTemplates()


module.exports = {
    resetState() {
        setDefaultTemplates()
    },

    setRole() { }, // do nothing, this is always teacher

    get(req, res) {
        return res.json({ total_count: TEMPLATES.length, items: TEMPLATES });
    },

    post(req, res) {
        const tmpl = Factory.create('GradingTemplate');
        Object.assign(tmpl, req.body);
        return res.json(tmpl);
    },

    put(req, res) {
        const tmpl = TEMPLATES_MAP[parseInt(req.params.id)];
        if (!tmpl) {
            return res.status(404).end('error');
        }
        Object.assign(tmpl, req.body);
        return res.json(tmpl);
    },

    route(server) {
        server.get('/api/courses/:courseId/grading_templates', this.get);
        server.post('/api/courses/:courseId/grading_templates', this.post);
        server.put('/api/grading_templates/:id', this.put);
    },
};
