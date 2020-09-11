const { getCourse } = require('./bootstrap');

module.exports = {

  setRole() { }, // do nothing, this is always teacher

  put(req, res) {
    const course = getCourse(req.params.id);
    Object.assign(course, req.body);
    return res.json(course);
  },

  route(server) {
    server.put('/api/courses/:id', this.put);
  },
};
