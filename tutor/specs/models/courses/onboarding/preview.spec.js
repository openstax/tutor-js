import { observable } from 'mobx';
import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';
import Course from '../../../../src/models/course';
import CoursePreviewUX from '../../../../src/models/course/onboarding/preview';
import Time from '../../../../src/models/time';

let mockCourses = observable.array();
Object.defineProperties(mockCourses, {
  isEmpty: {
    get: function() { return this.length === 0; },
  },
  api: {
    get: function() { return {}; },
  },
});

let mockActiveCoursePlans = observable.array();
jest.mock('../../../../src/models/courses-map', () => ({
  tutor: { currentAndFuture: { get nonPreview() { return mockCourses; } } },
}));

jest.mock('../../../../src/models/course');
jest.mock('../../../../src/models/task-plans/teacher');

describe('Course Preview Onboarding', () => {
  let ux;

  beforeEach(() => {
    const course = new Course(TEACHER_COURSE_TWO_MODEL);
    course.teacherTaskPlans = { active: mockActiveCoursePlans, api: {} };
    course.offering = { is_available: true };
    ux = new CoursePreviewUX(course, { tour: null });
    ux._setTaskPlanPublish(false);
  });

  it('#shouldWarnPreviewOnly', () => {
    ux._setTaskPlanPublish();
    expect(ux.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.replace([
      { is_preview: true, type: 'homework' },
      { is_preview: false, type: 'homework' },
      { is_preview: true, type: 'reading' },
    ]);
    expect(ux.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.push({ is_preview: false, type: 'external' });
    expect(ux.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.push({ is_preview: false, type: 'reading' });
    expect(ux.shouldWarnPreviewOnly).toBe(true);
  });

  it('#hasCreatedRealCourse', () => {
    mockCourses.push({ is_preview: false });
    expect(ux.hasCreatedRealCourse).toBe(true);
  });

  it('#nagComponent', () => {
    mockCourses.clear();
    expect(ux.nagComponent).toBeNull();
    ux.course.ends_at = Time.now - 100;
    ux.course.hasEnded = true;
    mockActiveCoursePlans.clear();
    expect(ux.nagComponent).not.toBeNull();
  });

});
