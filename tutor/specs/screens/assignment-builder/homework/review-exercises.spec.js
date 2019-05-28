import { React, C } from '../../../helpers';
import { map } from 'lodash';
import ReviewExercises from '../../../../src/screens/assignment-builder/homework/review-exercises';
import Factory, { FactoryBot } from '../../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';
import { ExtendBasePlan } from '../task-plan-helper';
import { TaskPlanStore } from '../../../../src/flux/task-plan';

const PLAN_ID  = '1';
const NEW_PLAN = ExtendBasePlan({ id: PLAN_ID });

jest.mock('react-dom');
jest.mock('../../../../src/flux/task-plan');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('choose exercises component', function() {
  let exercises, props, course;

  beforeEach(function() {
    course = Factory.course();
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    exercises = Factory.exercisesMap({ book: course.referenceBook });
    const pageIds = course.referenceBook.children[1].children.map(pg => pg.id);
    const items = pageIds.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: course.referenceBook.pages.byId.get(page_id).uuid }),
    );
    exercises.onLoaded({ data: { items } }, [{ course, page_ids: pageIds }]);
    TaskPlanStore.getExercises.mockImplementation(() => map(exercises.array, 'id'));

    props = {
      course,
      exercises,
      pageIds,
      onAddClick: jest.fn(),
      windowImpl: new FakeWindow,
      showSectionTopics: jest.fn(),
      canEdit: false,
      planId: PLAN_ID,
      cancel: jest.fn(),
      hide: jest.fn(),
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<C><ReviewExercises {...props} /></C>).toMatchSnapshot();
  });

});
