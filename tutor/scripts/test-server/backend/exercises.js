const Factory = require('object-factory-bot');
const { range, flatMap, concat } = require('lodash');
const Readings = require('./readings');
require('../../../specs/factories/exercise');

const WRM_PLAN_ID = 3;
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

const EXERCISES = {};


function getExercise(id) {
  return EXERCISES[id] || (EXERCISES[id] = Factory.create(id % 3 == 0 ? 'OpenEndedTutorExercise' : 'TutorExercise', { id }));
}

const getHandler = (req, res) => {
  if (req.query.exercise_ids) {
    const items = req.query.exercise_ids.map((exId) => getExercise(exId));
    if (req.query.task_plan_id == WRM_PLAN_ID) {
      items.forEach(ex => ex.content.questions.forEach(q => {
        q.formats = ['free-response'];
        q.pool_types = ['homework_core'];
        q.answers = [];
      }));
    }
    res.json({ items, total_count: items.length });
    return;
  }

  const book = Readings.getBook(req.params.ecosystemId);

  const exercises = flatMap(req.query.page_ids, pgId => {
    const pg = findPage(pgId, book);
    // eslint-disable-next-line
    if (!pg){ console.warn(`Unable to find page id ${pgId} in book id ${req.params.ecosystemId}`); }
    const exercises =  concat(
      range(8).map(() => Factory.create('TutorExercise', {
        page_uuid: pg ? pg.uuid : undefined,
      })),
      range(4).map(() => Factory.create('OpenEndedTutorExercise', {
        page_uuid: pg ? pg.uuid : undefined,
      })),
    );
    return exercises;
  });
  res.json({
    total_count: exercises.length,
    items: exercises,
  });
};

const publishHandler = (req, res) => {
  const ex = req.body;
  const source = EXERCISES[ex.derived_from_id];
  if (source) {
    source.content.questions[0].stem_html = ex.body.questionText;
    res.json(source);
  }
  // TODO handle create
  res.json({});
};

module.exports = {

  setRole(role) {
    ROLE = role;
  },

  getExercise,

  route(server) {
    server.get('/api/ecosystems/:ecosystemId/exercises', getHandler)
    server.get('/api/ecosystems/:ecosystemId/exercises/homework_core', getHandler);
    server.get('/api/ecosystems/:ecosystemId/practice_exercises', getHandler);
    server.post('/api/courses/:courseId/exercises', publishHandler)
  }
};
