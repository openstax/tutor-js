import UX from '../../../src/screens/assignment-builder/ux';
import { Factory, TimeMock } from '../../helpers';

describe('Homework Builder', function() {
  let ux, plan;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    const course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    ux = new UX({ course, plan });
  });

  it('#selectedExercises', () => {
    expect(ux.selectedExercises).toHaveLength(0);
    ux.exercises = Factory.exercisesMap({
      now, book: ux.referenceBook,
    });
    ux.plan.settings.exercise_ids = [ux.exercises.array[0].id ];
    expect(ux.selectedExercises).toHaveLength(1);
  });

});
