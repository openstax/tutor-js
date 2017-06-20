import CourseBuilderUX from '../../../src/models/course/builder-ux';
import { bootstrapCoursesList } from '../../courses-test-data';
import Offerings from '../../../src/models/course/offerings';
import Router from '../../../src/helpers/router';
import { extend, defer } from 'lodash';
jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/course/offerings', () => ({
  get: jest.fn(() => undefined),
}));

describe('Course Builder UX Model', () => {
  let ux, courses, mockOffering;
  beforeEach(() => {
    Router.currentParams.mockReturnValue({});
    courses = bootstrapCoursesList();
    mockOffering = { id: 1, title: 'A Test Course' };
    ux = new CourseBuilderUX();
  });

  function advanceToName() {
    expect(ux.stage).toEqual('offering');
    expect(ux.canGoBackward).toBe(false);
    expect(ux.canGoForward).toBe(false);
    ux.newCourse.offering = mockOffering;
    Offerings.get.mockReturnValue(mockOffering);
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.canGoBackward).toBe(true);
    expect(ux.stage).toEqual('term');
    expect(ux.canGoForward).toBe(false);
    ux.newCourse.term = { year: 2018 };
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.stage).toEqual('name');
  }

  function advanceToSave() {
    ux.goForward();
    expect(ux.stage).toEqual('numbers');
    expect(ux.canGoForward).toBe(false);
    extend(ux.newCourse, {
      num_sections: 3,
      estimated_student_count: 100,
    });
    expect(ux.canGoForward).toBe(true);

    ux.newCourse.save = jest.fn(() => Promise.resolve());
    ux.goForward();
    expect(ux.stage).toEqual('build');
    expect(ux.canNavigate).toBe(false);
    expect(ux.newCourse.save).toHaveBeenCalled();
  }

  it('calculates first stage', () => {
    expect(ux.firstStageIndex).toEqual(0);
    Router.currentParams.mockReturnValue({ sourceId: '1' });
    ux = new CourseBuilderUX();
    expect(ux.firstStageIndex).toEqual(1);
  });

  it('can advance through specs for a cloned course', () => {
    advanceToName();
    expect(ux.newCourse.name).toEqual(mockOffering.title);
    expect(ux.newCourse.num_sections).toEqual(courses.get(2).periods.length);
    expect(ux.canGoForward).toBe(true); // fields are already set from clone
    advanceToSave();
  });

  it('goes to dashboard after canceling', () => {
    ux.router = { transitionTo: jest.fn() };
    const { onCancel } = ux;
    onCancel();
    expect(ux.router.transitionTo).toHaveBeenCalledWith('/dashboard');
  });

  describe('after course is created', function() {
    beforeEach(() => {
      ux.router = { transitionTo: jest.fn() };
      ux.newCourseMock = { id: 42 };
      ux.newCourse.term = { year: 2018, term: 'spring' };
      ux.newCourse.save = jest.fn(() => ({ then: (c) => {
        ux.newCourse.onCreated({ data: ux.newCourseMock });
        c();
      } }));
    });

    it('redirects to Tutor for Tutor', function() {
      ux.currentStageIndex = ux.stages.length - 1;
      expect(ux.router.transitionTo).toHaveBeenCalledWith('/course/42?showIntro=true');
    });

    it('redirects to CC', function() {
      ux.newCourseMock.is_concept_coach = true;
      ux.currentStageIndex = ux.stages.length - 1;
      expect(ux.router.transitionTo).toHaveBeenCalledWith('/course/42/cc/help?showIntro=true');
    });
  });


});
