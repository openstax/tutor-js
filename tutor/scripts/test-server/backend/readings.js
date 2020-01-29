const Factory = require('object-factory-bot');
require('../../../specs/factories/book');

let ROLE = 'teacher';

const Books = {};

const Api = {

  getBook(ecoId) {
    let book = Books[ecoId];
    if (!book) {
      const type = (0 == ecoId % 2) ? 'physics' : 'biology';
      book = Books[ecoId] = Factory.create('Book', { type, id: ecoId });
    }
    return book;
  },

  setRole(role) {
    ROLE = role;
  },

  handler(req, res) {
    res.json([Api.getBook(req.params.ecosystemId)]);
  },

};

module.exports = Api;
