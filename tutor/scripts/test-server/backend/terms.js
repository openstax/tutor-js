const Factory = require('object-factory-bot');

const TERMS = Factory.create('User').available_terms;

module.exports = {
  TERMS,

  setRole(){ },


  route(server) {
    server.get('/api/terms', (req, res) => {
      return res.json(
        TERMS.map(t => ({ ...t, content: t.name == 'exercise_editing' ? 'I will only edit good things' : 'I pledge to be a good user' })),
      );
    });

    server.put('/api/terms/:id', (req, res) => {
      const term = TERMS.find(t => t.id == req.params.id);
      if (term) {
        Object.assign(term, { is_signed: true });
      }
      return res.json(term ? term : null);
    });
  },

};
