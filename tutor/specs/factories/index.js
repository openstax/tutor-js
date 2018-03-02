import FactoryBot from 'object-factory-bot';
import { each, camelCase, range } from 'lodash';
import '../../../shared/specs/factories';
import Course from '../../src/models/course';
import TutorExercise from '../../src/models/exercises/exercise';
import Book from '../../src/models/reference-book';
import { ExercisesMap } from '../../src/models/exercises';
import './course';
import './book';
import './exercise';

const Factories = {};

each({
  Course,
  TutorExercise,
  Book,
}, (Model, name) => {
  Factories[camelCase(name)] = (attrs = {}) => {
    const o = FactoryBot.create(name, attrs);
    return new Model(o);
  };
});

Factories.exercisesMap = ({ book, pageIds = [], count = 4 }) => {
  const map = new ExercisesMap();
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


export { FactoryBot };
export default Factories;
