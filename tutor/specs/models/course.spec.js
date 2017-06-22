import Courses from '../../src/models/courses-map';
import { autorun } from 'mobx';
import { bootstrapCoursesList } from '../courses-test-data';
import TeacherTaskPlans from '../../src/models/teacher-task-plans';
jest.mock('shared/src/model/ui-settings');
jest.mock('../../src/models/teacher-task-plans', () => ({
  forCourseId: jest.fn(() => ({
    reading:  { hasPublishing: false },
    homework: { hasPublishing: false },
  })),
}));
describe('Course Model', () => {

  beforeEach(() => bootstrapCoursesList());

  it('can be bootstrapped and size observed', () => {
    Courses.clear();
    const lenSpy = jest.fn();
    autorun(() => lenSpy(Courses.size));
    expect(lenSpy).toHaveBeenCalledWith(0);
    bootstrapCoursesList();
    expect(lenSpy).toHaveBeenCalledWith(3);
    expect(Courses.size).toEqual(3);
  });

  it('#isStudent', () => {
    expect(Courses.get(1).isStudent).toBe(true);
    expect(Courses.get(2).isStudent).toBe(false);
    expect(Courses.get(3).isStudent).toBe(true);
  });

  it('#isTeacher', () => {
    expect(Courses.get(1).isTeacher).toBe(false);
    expect(Courses.get(2).isTeacher).toBe(true);
    expect(Courses.get(3).isTeacher).toBe(true);
  });

  it('calculates audience tags', () => {
    expect(Courses.get(1).tourAudienceTags).toEqual(['student']);
    const teacher = Courses.get(2);
    expect(teacher.tourAudienceTags).toEqual(['teacher']);
    teacher.is_preview = true;
    expect(teacher.tourAudienceTags).toEqual(['teacher-preview']);
    const course = Courses.get(3);
    expect(course.tourAudienceTags).toEqual(['teacher', 'student']);
    course.is_preview = false;

    TeacherTaskPlans.forCourseId.mockImplementation(() => ({
      reading: { hasPublishing: true },
      homework: { hasPublishing: false },
    }));
    expect(course.tourAudienceTags).toEqual(['teacher', 'teacher-reading-published', 'student' ]);
  });


  it('should return expected roles for courses', function() {
    expect(Courses.get(1).primaryRole.type).to.equal('student');
    expect(Courses.get(2).primaryRole.type).to.equal('teacher');
    expect(Courses.get(3).primaryRole.type).to.equal('teacher');
  });

  it('sunsets cc courses', () => {
    const course = Courses.get(2);
    expect(course.isSunsetting).toEqual(false);
    course.is_concept_coach = true;
    course.appearance_code = 'physics';
    expect(course.isSunsetting).toEqual(false);
    course.appearance_code = 'micro_econ';
    expect(course.isSunsetting).toEqual(true);
  });

});
