import { React, SnapShot } from '../../helpers/component-testing';
import { last } from 'lodash';
import ChooseExercises from '../../../../src/components/task-plan/homework/choose-exercises';
import Factory, { FactoryBot } from '../../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';
import { ExtendBasePlan } from '../../helpers/task-plan';
import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';
import ScrollTo from '../../../../src/helpers/scroll-to';

jest.mock('../../../../src/helpers/scroll-to');
jest.mock('../../../../src/flux/task-plan', () => ({
  TaskPlanActions: {
    updateTopics: jest.fn(),
    addExercise: jest.fn(),
  },
  TaskPlanStore: {
    on: jest.fn(),
    off: jest.fn(),
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

function renderExerciseCards(props) {
  const ce = mount(<ChooseExercises {...props} />);
  const page_ids = props.course.referenceBook.children[1].children.map(pg => pg.id);
  TaskPlanStore.getTopics.mockImplementation(() => page_ids);
  ce.find('.chapter-heading .tutor-icon').at(1).simulate('click');
  expect(ce).toHaveRendered('.show-problems[disabled=false]');
  props.exercises.fetch = jest.fn();
  ce.find('.show-problems').simulate('click');
  expect(props.exercises.fetch).toHaveBeenCalled();
  const items = page_ids.map(page_id =>
    FactoryBot.create('TutorExercise', { page_uuid: props.course.referenceBook.pages.byId.get(page_id).uuid }),
  );
  props.exercises.onLoaded({ data: { items } }, [{ course: props.course, page_ids }]);
  return ce;
}

describe('choose exercises component', function() {
  let exercises, props, course;

  beforeEach(function() {
    course = Factory.course();
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    exercises = Factory.exercisesMap({ book: course.referenceBook });

    return props = {
      course,
      exercises,
      windowImpl: new FakeWindow,
      canEdit: false,
      planId: PLAN_ID,
      cancel: jest.fn(),
      hide: jest.fn(),
    };
  });

  it('renders selections', () => {
    expect(SnapShot.create(<ChooseExercises {...props} />).toJSON()).toMatchSnapshot();
  });

  it('can select exercises', () => {
    const ce = renderExerciseCards(props);
    const uid = ce.find('[data-exercise-id]').last().prop('data-exercise-id');
    const exercise = exercises.array.find(e => uid == e.content.uid);
    ce.find(`[data-exercise-id="${uid}"] .action.include`).simulate('click');
    expect(exercise.isSelected).toEqual(true);
    expect(TaskPlanActions.addExercise).toHaveBeenCalledWith(PLAN_ID, exercise.id);
    expect(ce).toHaveRendered('.exercise-controls-bar .review-exercises');
    expect(SnapShot.create(<ChooseExercises {...props} />).toJSON()).toMatchSnapshot();
    ce.unmount();
  });

  it('hides excluded exercises', () => {
    const ce = renderExerciseCards(props);
    const exercise = exercises.array[0];
    expect(exercise.isAssignable).toBe(true);
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = true;
    expect(exercise.isAssignable).toBe(false);
    expect(ce).not.toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    ce.unmount();
  });

  it('shows exercise details', () => {
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
