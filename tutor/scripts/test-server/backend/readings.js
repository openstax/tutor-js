const Factory = require('object-factory-bot');
require('../../../specs/factories/book');

let ROLE = 'teacher';

const Books = {};

const Api = {

  getBook(ecoId) {
    const id = parseInt(ecoId);
    let book = Books[id];
    if (!book) {
      const type = (0 == id % 2) ? 'physics' : 'biology';
      book = Books[id] = Factory.create('Book', { type, id });
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
