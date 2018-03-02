import { React, SnapShot } from '../../helpers/component-testing';
import ChooseExercises from '../../../../src/components/task-plan/homework/choose-exercises';
import Factory, { FactoryBot } from '../../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';
import { ExtendBasePlan } from '../../helpers/task-plan';
import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';

jest.mock('../../../../src/flux/task-plan', () => ({
  TaskPlanActions: {
    updateTopics: jest.fn(),
  },
  TaskPlanStore: {
    exerciseCount: jest.fn(() => 5),
    getTutorSelections: jest.fn(() => 3),
    canDecreaseTutorExercises: jest.fn(() => true),
    canIncreaseTutorExercises: jest.fn(() => true),
    getTopics: jest.fn(() => []),
  },
}));

// import { Testing, sinon, _, React } from '../../helpers/component-testing';
// _ = require('underscore');
// import moment from 'moment-timezone';
//
// import { TocActions, TocStore } from '../../../../src/flux/toc';
// import Courses from '../../../../src/models/courses-map';
//
// const ECOSYSTEM_ID = '1';
// const COURSE_ID    = '1';
//
// import COURSE from '../../../../api/user/courses/1.json';
// import READINGS from '../../../../api/ecosystems/1/readings.json';
const PLAN_ID      = '1';
const NEW_PLAN = ExtendBasePlan({ id: PLAN_ID });
//
// const ChooseExercises = require('../../../../src/components/task-plan/homework/choose-exercises');

describe('choose exercises component', function() {
  let exercises, props, course;

  beforeEach(function() {
    course = Factory.course();
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    exercises = Factory.exercisesMap({ book: course.referenceBook });

    return props = {
      course,
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

  fit('updates when page clicked', () => {
    const ce = mount(<ChooseExercises {...props} />);
    const pageIds = course.referenceBook.children[1].children.map(pg => pg.id);
    TaskPlanStore.getTopics.mockImplementation(() => pageIds);

    expect(ce).toHaveRendered('.show-problems[disabled=true]');
    ce.find('.chapter-heading .tutor-icon').at(1).simulate('click');
    expect(ce).toHaveRendered('.show-problems[disabled=false]');
    //exercises.fetch = jest.fn();

    ce.find('.show-problems').simulate('click');

    //expect(exercises.fetch).toHaveBeenCalledWith();


    //    ce.update();


    // expect(TaskPlanActions.updateTopics).toHaveBeenCalledWith(String(course.id), pageIds);
    // exercises.fetch = jest.fn();
    // console.log("CLIC")



    //    expect(props.onSelectionChange).toHaveBeenCalledWith(pageIds);

    console.log(ce.debug());
    //Testing.renderComponent( ChooseExercises, { props } ).then(({ dom }) => expect(dom.querySelector('[data-chapter-section="1.1"]')).to.exist)
  });

  // return it('hides exercises onSectionChange', () =>
  //   Testing.renderComponent( ChooseExercises, { props, unmountAfter: 10 } ).then(function({ dom, element }) {
  //     Testing.actions.click( dom.querySelector('.section') );
  //     return expect(element.state.showProblems).to.be.false;
  //   })
  // );
});
