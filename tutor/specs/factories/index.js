import Factory from 'object-factory-bot';
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
    const o = Factory.create(name, attrs);
    return new Model(o);
  };
});

Factories.exercisesMap = ({ ecosystem_id, pageIds, count }) => {
  const map = new ExercisesMap();
  pageIds.forEach(pg => {
    map.onLoaded(
      { data: { items: range(count).map(() => Factory.create('TutorExercise')) } },
      [{ ecosystem_id, page_id: pg }]
    );
  });
  return map;
};


export { Factory as FactoryBot };
export default Factories;
