const Factory = require('object-factory-bot');
require('../../../specs/factories/course');
const { getCourse } = require('./bootstrap');

module.exports = {

    setRole() { },
    resetState() {},

    put(req, res) {
        const course = getCourse(req.params.id);
        Object.assign(course, req.body);
        return res.json(course);
    },

    //course 1, return an exercise that is available
    //course 2, return an exercise that is not available
    //rest, return empty
    getPracticeQuestions(req, res) {
        const courseId = req.params.id;
        if(courseId === '1')
            return res.json([{ exercise_id: 22, available: true }]);
        else if (courseId === '2')
            return res.json([{ exercise_id: 22, available: false }]);
        else
            return res.json([]);
    },

    savePracticeQuestion(req, res) {
        return res.json({
            exercise_id: 22,
        });
    },

    deletePracticeQuestion(req, res) {
        return res.json();
    },

    checkExistingSavedPractice(req, res) {
        return res.json({ id: null });
    },

    create(req, res) {
        return res.json(
            Factory.create('Course', req.body)
        );
    },

    clone(req, res) {
        const course = getCourse(req.params.id);
        const nextId = Factory.create('Course', req.body).id
        return res.json({ ...course, ...req.body, id: nextId });
    },

    route(server) {
        server.put('/api/courses/:id', this.put);
        server.post('/api/courses/:id/clone', this.clone);
        server.post('/api/courses', this.create);
        server.get('/api/courses/:id/practice_questions', this.getPracticeQuestions);
        server.post('/api/courses/:id/practice_questions', this.savePracticeQuestion);
        server.delete('/api/courses/:id/practice_questions/:pqId', this.deletePracticeQuestion);
        server.get('/api/courses/:id/practice/saved', this.checkExistingSavedPractice);
    },
};
