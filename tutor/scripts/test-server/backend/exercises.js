const Factory = require('object-factory-bot');
const { partial, find, range, flatMap } = require('lodash');
const Readings = require('./readings');
require('../../../specs/factories/exercise');

let ROLE = 'teacher';

const findPage = (id, parent) => {
  for (let i in parent.children) {
    const pg = parent.children[i];
    if (pg.id == id) {
      return pg;
    }
    const child = findPage(id, pg);
    if (child) { return child; }
  }
};

module.exports = {

  setRole(role) {
    ROLE = role;
  },

  handler(req, res) {
    const book = Readings.getBook(req.params.ecosystemId);
    const exercises = flatMap(req.query.page_ids, pgId => {
      const pg = findPage(pgId, book);
      return range(5).map(() => Factory.create('TutorExercise', {
        page_uuid: pg ? pg.uuid : undefined,
      }));
    });


    res.json({
      total_count: exercises.length,
      items: exercises,
    });
    // const type = (0 == req.params.ecosystemId % 2) ? 'physics' : 'biology';

    // res.json([Factory.create('Book', { type })]);
  },

};