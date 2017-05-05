import CoursePreviewBehaviour from '../../../src/models/course/preview-behaviour';
import { autorun, observable } from 'mobx';
import { bootstrapCoursesList } from '../../courses-test-data';

let mockActiveCoursePlans = observable.array();

jest.mock('../../../src/models/teacher-task-plans', () => ({
  forCourseId() {
    return {
      active: mockActiveCoursePlans,
    };
  },
}));

describe('Course Preview Behaviour', () => {
  let behaviour;

  beforeEach(() => {
    const courses = bootstrapCoursesList([1]);
    behaviour = new CoursePreviewBehaviour(courses.get(1));
  });

  afterEach(() => {

  });

  it('#shouldWarnPreviewOnly', () => {
    expect(behaviour.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.replace([
      { is_demo: true }, { is_demo: false }, { is_demo: false },
    ]);
    expect(behaviour.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.push({ is_demo: false });
    expect(behaviour.shouldWarnPreviewOnly).toBe(true);
  });

  it('#tourAudienceTags', () => {
    const dispose = autorun(jest.fn(() => behaviour.tourAudienceTags ));
    mockActiveCoursePlans.replace([
      { is_demo: true }, { is_demo: false }, { is_demo: false }, { is_demo: false },
    ]);
    expect(behaviour.shouldWarnPreviewOnly).toBe(true);
    expect(behaviour.tourAudienceTags).toEqual(['preview-warning']);
    dispose();
  });
});
