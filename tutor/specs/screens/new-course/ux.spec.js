import BuilderUX from '../../../src/screens/new-course/ux';
import { bootstrapCoursesList } from '../../courses-test-data';
import Offerings from '../../../src/models/course/offerings';
import Router from '../../../src/helpers/router';
import User from '../../../src/models/user';

jest.useFakeTimers();
jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/course/offerings', () => ({
  get: jest.fn(() => undefined),
  fetch: jest.fn(() => Promise.resolve()),
  api: { isPending: false }
}));
jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));

describe('Course Builder UX Model', () => {
  let ux, courses, mockOffering;
  beforeEach(() => {
    Router.currentParams.mockReturnValue({});
    User.isCollegeTeacher = true;
    courses = bootstrapCoursesList();
    mockOffering = { id: 1, title: 'A Test Course' };
    ux = new BuilderUX();
  });


  function advanceToSave() {
    expect(ux.stage).toEqual('numbers');
    ux.newCourse.setValue('num_sections', 11);
    ux.newCourse.setValue('estimated_student_count', 110);
    expect(ux.newCourse.error).toMatchObject({ attribute: 'sections', value: 10 });
    expect(ux.canGoForward).toBe(false);
    ux.newCourse.setValue('num_sections', 9);
    expect(ux.newCourse.error).toBeNull();
    expect(ux.canGoForward).toBe(true);

    ux.newCourse.save = jest.fn(() => Promise.resolve());
    ux.goForward();
    expect(ux.stage).toEqual('build');
    expect(ux.canNavigate).toBe(false);
    expect(ux.newCourse.save).toHaveBeenCalled();
  }

  it('sets cloned course when sourceId is present', () => {
    Router.currentParams.mockReturnValue({ sourceId: '2' });
    courses.get('2').name = 'CLONE ME';
    ux = new BuilderUX();
    expect(ux.newCourse.cloned_from_id).toEqual('2');
    expect(ux.newCourse.name).toEqual('CLONE ME');
  });

  it('calculates first stage', () => {
    expect(ux.firstStageIndex).toEqual(0);
    Router.currentParams.mockReturnValue({ sourceId: '1' });
    ux = new BuilderUX();
    expect(ux.firstStageIndex).toEqual(1);
  });

  it('can advance through steps for new course', () => {
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

    expect(ux.stage).toEqual('new_or_copy');
    expect(ux.canGoForward).toBe(true);
    ux.goForward();
    expect(ux.stage).toEqual('name');
    expect(ux.newCourse.name).toEqual(mockOffering.title);

    ux.goBackward();
    expect(ux.stage).toEqual('new_or_copy');
    ux.newCourse.new_or_copy = 'copy';
    expect(ux.canGoForward).toBe(true);
    ux.goForward();

    const course = courses.get('2');

    expect(ux.stage).toEqual('cloned_from_id');
    expect(ux.canGoForward).toBe(false);
    ux.source = course;

    expect(ux.canGoForward).toBe(true);
    ux.goForward();
    expect(ux.stage).toEqual('name');
    expect(ux.newCourse.name).toEqual(course.name);
    ux.goForward();
    expect(ux.newCourse.num_sections).toEqual(course.periods.length);
    advanceToSave();
  });

  it('can advance through steps for cloned course', () => {
    const course = courses.get('2');
    Router.currentParams.mockReturnValue({ sourceId: course.id });
    ux = new BuilderUX();
    expect(ux.stage).toEqual('term');
    expect(ux.canGoForward).toBe(false);
    ux.newCourse.term = { year: 2018 };
    expect(ux.canGoForward).toBe(true);
    ux.goForward();
    expect(ux.stage).toEqual('name'); // new_or_copy is skipped
    expect(ux.canGoForward).toBe(true);
    expect(ux.newCourse.name).toEqual(course.name);
    expect(ux.canGoForward).toBe(true);
    ux.goForward();
    expect(ux.newCourse.num_sections).toEqual(course.periods.length);
    advanceToSave();
  });

  it('goes to dashboard after canceling', () => {
    ux.router = {
      route: { match: { params: {} } },
      history: { push: jest.fn() },
    };
    const { onCancel } = ux;
    onCancel();
    expect(ux.router.history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('shows unavailable message for unavailable offerings', () => {
    ux = new BuilderUX();
    Offerings.get.mockImplementation((id) => (
      id == 1 ?
        { is_available: false, isLegacyBiology: true } :
        { is_available: false, isLegacyBiology: false }
    ));
    ux.newCourse.offering_id = 1;
    expect(ux.stage).toEqual('bio1e_unavail');
    ux.newCourse.offering_id = 2;
    expect(ux.stage).toEqual('offering_unavail');
  });

  it('shows unavailable message for future bio', () => {
    ux = new BuilderUX();
    Offerings.get.mockImplementation(() => ({ isLegacyBiology: true }));
    ux.goForward();
    ux.newCourse.term = { term: 'winter', year: 2018 };
    ux.goForward();
    expect(ux.stage).toEqual('bio2e_unavail');
    ux.goBackward();
    ux.newCourse.term.term = 'spring';
    ux.goForward();
    expect(ux.stage).toEqual('name');
  });

  it('redirects to onlly college page if teacher isnt college', () => {
    const router = {
      route: { match: { params: {} } },
      history: { replace: jest.fn() },
    };
    User.isCollegeTeacher = false;
    ux = new BuilderUX(router);
    Router.makePathname.mockReturnValue('/only-teacher');
    jest.runOnlyPendingTimers();
    expect(ux.router.history.replace).toHaveBeenCalledWith('/only-teacher');
  });

  describe('after course is created', function() {
    beforeEach(() => {
      ux.router = {
        route: { match: { params: {} } },
        history: { push: jest.fn() },
      };
      ux.newCourseMock = { id: 42 };
      ux.newCourse.term = { year: 2018, term: 'spring' };
      ux.newCourse.save = jest.fn(() => ({ then: (c) => {
        ux.newCourse.onCreated({ data: ux.newCourseMock });
        c();
      } }));
    });

    it('redirects after building', function() {
      ux.currentStageIndex = ux.stages.length - 1;
      expect(ux.router.history.push).toHaveBeenCalledWith('/course/42?showIntro=true');
    });

  });

});
