import { React, C } from '../../../helpers';
import { last, map } from 'lodash';
import ChooseExercises from '../../../../src/screens/assignment-builder/homework/choose-exercises';
import Factory, { FactoryBot } from '../../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';
import { ExtendBasePlan } from '../task-plan-helper';
import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';
import ScrollTo from '../../../../src/helpers/scroll-to';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);
jest.mock('../../../../src/helpers/scroll-to');
jest.mock('../../../../src/flux/task-plan', () => ({
  TaskPlanActions: {
    updateTopics: jest.fn(),
    addExercise: jest.fn(),
  },
  TaskPlanStore: {
    on: jest.fn(),
    off: jest.fn(),
    getExercises: jest.fn(() => []),
    hasExercise: jest.fn(() => false),
    exerciseCount: jest.fn(() => 5),
    getTutorSelections: jest.fn(() => 3),
    canDecreaseTutorExercises: jest.fn(() => true),
    canIncreaseTutorExercises: jest.fn(() => true),
    getTopics: jest.fn(() => []),
  },
}));

const PLAN_ID  = '1';
const NEW_PLAN = ExtendBasePlan({ id: PLAN_ID });

describe('choose exercises component', function() {
  let exercises, props, course, page_ids, availableExercises;

  function renderExerciseCards(props) {
    props.exercises.fetch = jest.fn();
    const ce = mount(<C><ChooseExercises {...props} /></C>);
    ce.find('.chapter-checkbox button').at(1).simulate('click');
    ce.find('.card-footer button.show-problems').simulate('click');

    expect(props.exercises.fetch).toHaveBeenCalled();

    props.exercises.onLoaded({ data: { items: availableExercises } }, [{ book: props.course.referenceBook, page_ids }]);

    return ce.update();
  }

  beforeEach(function() {
    course = Factory.course();
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    exercises = Factory.exercisesMap({ book: course.referenceBook });

    props = {
      course,
      exercises,
      windowImpl: new FakeWindow,
      canEdit: false,
      planId: PLAN_ID,
      cancel: jest.fn(),
      hide: jest.fn(),
    };

    page_ids = props.course.referenceBook.children[1].children.map(pg => pg.id);
    TaskPlanStore.getTopics.mockImplementation(() => page_ids);
    availableExercises = page_ids.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: props.course.referenceBook.pages.byId.get(page_id).uuid }),
    );

  });

  it('renders selections', () => {
    expect.snapshot(<C><ChooseExercises {...props} /></C>).toMatchSnapshot();
  });

  it('can select exercises', () => {
    const ce = renderExerciseCards(props);
    const uid = ce.find('[data-exercise-id]').last().prop('data-exercise-id');
    const exercise = exercises.array.find(e => uid == e.content.uid);
    ce.find(`[data-exercise-id="${uid}"] .action.include`).simulate('click');
    expect(exercise.isSelected).toEqual(true);
    expect(TaskPlanActions.addExercise).toHaveBeenCalledWith(PLAN_ID, exercise.id);
    expect(ce).toHaveRendered('SectionsExercises');
    expect.snapshot(<C><ChooseExercises {...props} /></C>).toMatchSnapshot();
    ce.unmount();
  });

  it('hides excluded and reading exercises', () => {
    const ce = renderExerciseCards(props);
    const exercise = exercises.array[0];
    exercise.pool_types = ['homework_core'];
    expect(exercise.isHomework).toBe(true);
    expect(exercise.isAssignable).toBe(true);
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = true;
    expect(exercise.isAssignable).toBe(false);
    expect(ce).not.toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = false;
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.pool_types = ['reading_dynamic'];
    expect(exercise.isReading).toBe(true);
    expect(ce).not.toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    ce.unmount();
  });

  it ('always displays previous selections', () => {
    const exerciseId = availableExercises[0].id;
    TaskPlanStore.getExercises.mockImplementation(() => [exerciseId]);
    const ce = renderExerciseCards(props);
    const exercise = exercises.get(exerciseId);
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = true;
    expect(exercise.isAssignable).toBe(false);
    // it still renders because it's part of the task plan
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
  });

  it('shows exercise details', () => {
    TaskPlanStore.getExercises.mockImplementation(() => map(availableExercises, 'id'));
    const ce = renderExerciseCards(props);
    const uid = ce.find('[data-exercise-id]').first().prop('data-exercise-id');
    ce.find(`[data-exercise-id="${uid}"] .action.details`).simulate('click');
    expect(ce).toHaveRendered('.exercise-details');
    expect(ce).toHaveRendered('a[disabled=true][title="Go Back"]');
    expect(ce).toHaveRendered('a[disabled=false][title="Go Forward"]');
    ce.find('a.show-cards').simulate('click');
    expect(ce).toHaveRendered('.exercise-cards');
    expect(last(ScrollTo.mock.instances).scrollToSelector).toHaveBeenCalledWith(
      `[data-exercise-id="${uid}"]`, { immediate: true }
    );
    ce.unmount();
  });

});
