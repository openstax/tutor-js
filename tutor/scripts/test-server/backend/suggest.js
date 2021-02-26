const Factory = require('object-factory-bot');

module.exports = {

  setRole(){ },

  route(server) {
    server.post('/api/user/suggest', (req, res) => {
      return res.json({});
    });
  },

};
