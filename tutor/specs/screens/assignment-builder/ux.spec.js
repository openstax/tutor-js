import UX from '../../../src/screens/assignment-builder/ux';
import { Factory, TimeMock } from '../../helpers';

describe('Assignment Builder UX', function() {
  let ux, plan, course;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    course = Factory.course();
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

  it('initializes a cloned plan', async () => {
    ux = new UX();
    jest.spyOn(course, 'pastTaskPlans', 'get').mockImplementation(() => ({
      get() { return plan; },
      fetch: jest.fn(() => Promise.resolve()),
      api: { hasBeenFetched: false },
    }));

    await ux.initialize({
      type: 'clone',
      id: plan.id,
      course,
    });

    expect(ux.sourcePlanId).toEqual(plan.id);
    expect(ux.plan.isNew).toBe(true);
    expect(ux.plan.title).toEqual(plan.title);
    expect(ux.referenceBook.id).toEqual(plan.ecosystem_id);
  });

});
