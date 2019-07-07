import { React, C, FakeWindow, ld } from '../../../helpers';
import AddExercises from '../../../../src/screens/assignment-builder/homework/add-exercises';
import UX from '../../../../src/screens/assignment-builder/ux';
import Factory from '../../../factories';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('choose exercises component', () => {
  let exercises, props, plan, ux;

  beforeEach(function() {
    const course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    ux = new UX({ course, plan, windowImpl: new FakeWindow });
    ux.exercises = Factory.exercisesMap({ book: ux.referenceBook });
    ux.plan.settings.page_ids = Object.keys(ux.exercises.byPageId);
    props = { ux, exercises };
  });

  it('selects exercises', () => {
    const add = mount(<C><AddExercises {...props} /></C>);
    expect(add).not.toHaveRendered('.no-exercises-found');
    const exercise = ld.first(ux.exercises.array);
    add.find(
      `[data-exercise-id="${exercise.content.uid}"] .action.include`
    ).simulate('click');
    expect(plan.settings.exercise_ids).toContain(exercise.id);
    add.unmount();
  });

  it('matches snapshot', () => {
    expect.snapshot(<C><AddExercises {...props} /></C>).toMatchSnapshot();
  });

  it ('always displays previous selections', () => {
    const exercise = ux.exercises.array[3];
    exercise.pool_types = ['homework_core'];
    ux.plan.settings.exercise_ids = [ exercise.id ];
    const add = mount(<C><AddExercises {...props} /></C>);
    expect(add).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = true;
    expect(exercise.isAssignable).toBe(false);
    expect(ux.isExerciseSelected(exercise)).toBe(true);
    // it still renders because it's part of the task plan
    expect(add).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
  });
});
