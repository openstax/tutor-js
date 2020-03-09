import { React, C, TimeMock, createUX } from '../helpers';
import AddExercises from '../../../../src/screens/assignment-builder/homework/add-exercises';
import Factory from '../../../factories';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('choose exercises component', () => {
  let props, ux;

  const now = TimeMock.setTo('2015-01-12T10:00:00.000Z');

  beforeEach(async () => {
    ux = await createUX({ now });
    ux.exercises = Factory.exercisesMap({ book: ux.referenceBook });
    ux.plan.settings.page_ids = Object.keys(ux.exercises.byPageId);
    props = { ux };
  });

  it('selects exercises', () => {
    const add = mount(<C><AddExercises {...props} /></C>);
    expect(add).not.toHaveRendered('NoExercisesFound');
    const card= add.find('[data-exercise-id]').first();
    const exId = card.props()['data-exercise-id'];
    card.find('.action.include').simulate('click');
    expect(
      ux.exercises.get(ux.plan.settings.exercise_ids[0]).content.uid
    ).toEqual(exId);
    add.unmount();
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

  it('display exercises from proper ecosystem', () => {
    const add = mount(<C><AddExercises {...props} /></C>);
    expect(add.find('ExerciseCards').props().book).toBe(ux._referenceBook);
    add.unmount();
  });
});
