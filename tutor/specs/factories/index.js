import FactoryBot from 'object-factory-bot';
import { each, camelCase, range } from 'lodash';
import '../../../shared/specs/factories';
import faker from 'faker';
import Course from '../../src/models/course';
import TutorExercise from '../../src/models/exercises/exercise';
import Book from '../../src/models/reference-book';
import TaskPlanStat from '../../src/models/task-plan/stats';
import { EcosystemsMap, Ecosystem } from '../../src/models/ecosystems';
import { ExercisesMap } from '../../src/models/exercises';
import { ResearchSurvey } from '../../src/models/research-surveys/survey';
import './research_survey';
import './course';
import './book';
import './task-plan-stats'
import './ecosystem';
import './exercise';

const Factories = {};

each({
  Course,
  TutorExercise,
  Book,
  Ecosystem,
  TaskPlanStat,
  ResearchSurvey,
}, (Model, name) => {
  Factories[camelCase(name)] = (attrs = {}) => {
    const o = FactoryBot.create(name, attrs);
    return new Model(o);
  };
});

Factories.data = (...args) => FactoryBot.create(...args)

Factories.ecosystemsMap = ({ count = 4 } = {}) => {
  const map = new EcosystemsMap();
  map.onLoaded({ data: range(count).map(() => FactoryBot.create('Ecosystem')) });
  return map;
};

Factories.exercisesMap = ({ book, pageIds = [], count = 4 } = {}) => {
  const map = new ExercisesMap();
  if (!book) { return map; }
  pageIds.forEach(pgId => {
    map.onLoaded(
      { data: { items: range(count).map(() => FactoryBot.create('TutorExercise', {
        page_uuid: book.pages.byId.get(pgId).uuid,
      })) } },
      [{ book, page_ids: [ pgId ] }]
    );
  });
  return map;
};


export { FactoryBot, faker };
export default Factories;
