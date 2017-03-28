import Courses from '../../src/models/courses';
import { autorun } from 'mobx';
import { bootstrapCoursesList } from '../courses-test-data';

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
    expect(Courses.get(3).tourAudienceTags).toEqual(['teacher', 'student']);
  });

});
