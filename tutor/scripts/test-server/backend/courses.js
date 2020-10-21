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

  savePracticeQuestion(req, res) {
    return res.json({
      exercise_id: 22,
    });
  },

  checkExistingSavedPractice(req, res) {
    return res.json({ id: null });
  },

  route(server) {
    server.put('/api/courses/:id', this.put);
    server.get('/api/courses/:id/practice_questions', this.getPracticeQuestions);
    // /course/1/task/2/step/22  with exercise_id 22
    server.post('/api/courses/:id/practice_questions', this.savePracticeQuestion);
    server.get('/api/courses/:id/practice/saved', this.checkExistingSavedPractice);
  },
};
