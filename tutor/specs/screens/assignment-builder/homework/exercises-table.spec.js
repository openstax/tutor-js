import { React } from '../../../helpers';
import ReviewExercisesTable from '../../../../src/screens/assignment-builder/homework/exercises-table';
import Factory, { FactoryBot } from '../../../factories';
import { ExtendBasePlan } from '../task-plan-helper';
jest.mock('../../../../src/helpers/scroll-to');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);
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

describe('review exercises table', function() {
  let exercises, props, course;

  beforeEach(function() {
    Factory.setSeed(1); // make factory deterministic so it has both reading/hw
    course = Factory.course();
    course.referenceBook.onApiRequestComplete({
      data: [FactoryBot.create('Book')],
    });
    exercises = Factory.exercisesMap({
      book: course.referenceBook,
      pageIds: [
        course.referenceBook.pages.byId.keys()[0],
      ],
    });

    return props = {
      course,
      exercises: exercises.array,
      planId: PLAN_ID,
    };
  });

  it('renders selections', () => {
    expect.snapshot(<ReviewExercisesTable {...props} />).toMatchSnapshot();
  });

  it('strips images', () => {
    const [ex] = props.exercises;
    ex.content.questions[0].stem_html = `
      <div>
<p>hi image here: <img title="one"/></p>
<img title="two" />
        this is a test exercise
      </div>
    `;
    props.exercises = [ex];
    const et = mount(<ReviewExercisesTable {...props} />);
    const html = et.find(`tr[data-ex-id=${ex.id}] div[dangerouslySetInnerHTML]`).props().dangerouslySetInnerHTML.__html;
    expect(html).toContain('this is a test exercise');
    expect(html).not.toContain('img');
    expect(html).toMatchSnapshot();
    et.unmount();
  });

});
