import CoursePreviewBehaviour from '../../../src/models/course/preview-behaviour';
import { autorun } from 'mobx';
import { bootstrapCoursesList } from '../../courses-test-data';

let mockActiveCoursePlans = [];

jest.mock('../../../src/flux/teacher-task-plan', () => ({
  TeacherTaskPlanStore: {
    getActiveCoursePlans: jest.fn(() => mockActiveCoursePlans),
  },
}));

describe('Course Preview Behaviour', () => {
  let behaviour;

  beforeEach(() => {
    const courses = bootstrapCoursesList([1]);
    behaviour = new CoursePreviewBehaviour(courses.get(1));
  });

  afterEach(() => {
    mockActiveCoursePlans = [];
  });

  it('#shouldWarnPreviewOnly', () => {
    expect(behaviour.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans = [
      { is_demo: true }, { is_demo: false }, { is_demo: false },
    ];
    expect(behaviour.shouldWarnPreviewOnly).toBe(false);
    mockActiveCoursePlans.push({ is_demo: false });
    expect(behaviour.shouldWarnPreviewOnly).toBe(true);
  });


  it('#tourAudienceTags', () => {
    const dispose = autorun(jest.fn(() => behaviour.tourAudienceTags ));
    expect(behaviour.tourAudienceTags).toEqual([]);
    mockActiveCoursePlans = [
      { is_demo: true }, { is_demo: false }, { is_demo: false }, { is_demo: false },
    ];
    expect(behaviour.shouldWarnPreviewOnly).toBe(true);
    expect(behaviour.tourAudienceTags).toEqual(['preview-warning']);
    dispose()
  });

});
