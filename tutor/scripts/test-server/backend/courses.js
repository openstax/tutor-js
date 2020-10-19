const { getCourse } = require('./bootstrap');

module.exports = {

  setRole() { }, // do nothing, this is always teacher

  put(req, res) {
    const course = getCourse(req.params.id);
    Object.assign(course, req.body);
    return res.json(course);
  },

  getPracticeQuestions(req, res) {
    return res.json([]);
  },

  route(server) {
    server.put('/api/courses/:id', this.put);
    server.get('/api/courses/:id/practice_questions', this.getPracticeQuestions);
  },
};
