import { autorun, observable } from 'mobx';
import { TEACHER_COURSE_TWO_MODEL } from '../../courses-test-data';
import Course from '../../../src/models/course';
import CoursePreviewUX from '../../../src/models/course/preview-ux';

let mockCourses = observable.array();
let mockActiveCoursePlans = observable.array();
jest.mock('../../../src/models/courses-map', () => ({
  get array(){ return mockCourses; },
}));

jest.mock('../../../src/models/teacher-task-plans', () => ({
  forCourseId() {
    return {
      active: mockActiveCoursePlans,
    };
  },
}));

describe('Course Preview UX', () => {
  let ux;

  beforeEach(() => {
    ux = new CoursePreviewUX(new Course(TEACHER_COURSE_TWO_MODEL));
  });

  afterEach(() => {

  });

  it('#shouldWarnPreviewOnly', () => {
    expect(ux.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.replace([
      { is_demo: true }, { is_demo: false }, { is_demo: false },
    ]);
    expect(ux.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.push({ is_demo: false });
    expect(ux.shouldWarnPreviewOnly).toBe(true);
  });

  it('#hasCreatedRealCourse', () => {
    mockCourses.push({ is_preview: true });
    expect(ux.hasCreatedRealCourse).toBe(false);
    mockCourses.push({ is_preview: false });
    expect(ux.hasCreatedRealCourse).toBe(true);
  });

});
