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
  let ux;
  let courses;

  beforeEach(() => {
    Router.currentParams.mockReturnValue({});
    courses = bootstrapCoursesList();
    ux = new CourseBuilderUX();
  });

  function advanceToCopy() {
    expect(ux.stage).toEqual('offering');
    expect(ux.canGoBackward).toBe(false);
    expect(ux.canGoForward).toBe(false);
    ux.newCourse.offering_id = 1;
    Offerings.get.mockReturnValue({});
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.canGoBackward).toBe(true);
    expect(ux.stage).toEqual('term');
    expect(ux.canGoForward).toBe(false);
    ux.newCourse.term = { year: 2018 };
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.stage).toEqual('new_or_copy'); // will default to new
  }

  function advanceToSave() {
    ux.goForward();
    expect(ux.stage).toEqual('numbers');
    expect(ux.canGoForward).toBe(false);
    extend(ux.newCourse, {
      num_sections: 3,
      num_students: 100,
    });
    expect(ux.canGoForward).toBe(true);

    ux.newCourse.save = jest.fn(() => Promise.resolve());
    ux.goForward();
    expect(ux.stage).toEqual('build');
    expect(ux.canNavigate).toBe(false);
    expect(ux.newCourse.save).toHaveBeenCalled();
  }

  it('calculates first stage', () => {
    expect(ux.firstStageIndex).toEqual(1);
    Router.currentParams.mockReturnValue({ sourceId: '1' });
  });

  it('allows selecting CC if taught before', () => {
    expect(ux.firstStageIndex).toEqual(1);
    expect(ux.allCoursesOfType).toBe('tutor');
    courses.array[0].is_concept_coach = true;
    expect(ux.allCoursesOfType).toBeNull();
    expect(ux.firstStageIndex).toEqual(0);
    Offerings.get.mockReturnValue({});
    ux.source = courses.get('1');
    expect(ux.canSkipOffering).toEqual(true);
    expect(ux.firstStageIndex).toEqual(2);
    courses.array.forEach(c => (c.is_concept_coach = true));
    expect(ux.allCoursesOfType).toBe('cc');
    expect(ux.firstStageIndex).toEqual(2);
  });

  it('can advance through specs for a cloned course', () => {
    advanceToCopy();
    ux.newCourse.new_or_copy = 'copy';
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.canGoForward).toBe(false);
    expect(ux.stage).toEqual('cloned_from_id');
    ux.newCourse.cloned_from = courses.get(2);
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.stage).toEqual('name');
    expect(ux.newCourse.name).toEqual(courses.get(2).name);
    expect(ux.newCourse.num_sections).toEqual(courses.get(2).periods.length);
    expect(ux.canGoForward).toBe(true); // fields are already set from clone

    advanceToSave();
  });

  it('can advance through steps for a new course', () => {
    advanceToCopy();

    ux.newCourse.new_or_copy = 'new';
    expect(ux.canGoForward).toBe(true);

    ux.goForward();
    expect(ux.stage).toEqual('name');
    expect(ux.canGoForward).toBe(false);
    extend(ux.newCourse, {
      name: 'Test Course',
      time_zone: 'US/Eastern',
    });
    expect(ux.canGoForward).toBe(true);

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
        ux.newCourse.onCreated(ux.newCourseMock);
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
