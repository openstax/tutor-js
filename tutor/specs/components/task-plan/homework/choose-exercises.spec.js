import { React, SnapShot } from '../../helpers/component-testing';
import ChooseExercises from '../../../../src/components/task-plan/homework/choose-exercises';
import Factory, { FactoryBot } from '../../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';
import { ExtendBasePlan } from '../../helpers/task-plan';
import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';

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
    const ce = mount(<ChooseExercises {...props} />);
    const page_ids = course.referenceBook.children[1].children.map(pg => pg.id);
    TaskPlanStore.getTopics.mockImplementation(() => page_ids);
    exercises.foo = 1;

    expect(ce).toHaveRendered('.show-problems[disabled=true]');
    ce.find('.chapter-heading .tutor-icon').at(1).simulate('click');
    expect(ce).toHaveRendered('.show-problems[disabled=false]');
    exercises.fetch = jest.fn();

    ce.find('.show-problems').simulate('click');

    expect(exercises.fetch).toHaveBeenCalled();

    const items = page_ids.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: course.referenceBook.pages.byId.get(page_id).uuid }),
    );

    exercises.onLoaded({ data: { items } }, [{ course, page_ids }]);
    const uid = ce.find('[data-exercise-id]').last().prop('data-exercise-id');
    const exercise = exercises.array.find(e => uid == e.content.uid);

    ce.find(`[data-exercise-id="${uid}"] .action.include`).simulate('click');
    expect(exercise.isSelected).toEqual(true);
    expect(TaskPlanActions.addExercise).toHaveBeenCalledWith(PLAN_ID, exercise.id);

    expect(ce).toHaveRendered('.exercise-controls-bar .review-exercises');

    expect(SnapShot.create(<ChooseExercises {...props} />).toJSON()).toMatchSnapshot();

    ce.unmount();
  });

});
