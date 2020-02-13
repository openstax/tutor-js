const Factory = require('object-factory-bot');
const { partial, find, range, flatMap, concat } = require('lodash');
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
      // eslint-disable-next-line
      if (!pg){ console.warn(`Unable to find page id ${pgId} in book id ${req.params.ecosystemId}`); }
      return concat(
        range(8).map(() => Factory.create('TutorExercise', {
          page_uuid: pg ? pg.uuid : undefined,
        })),
        range(4).map(() => Factory.create('OpenEndedTutorExercise', {
          page_uuid: pg ? pg.uuid : undefined,
        })),
      );
    });
    res.json({
      total_count: exercises.length,
      items: exercises,
    });
  },

};
