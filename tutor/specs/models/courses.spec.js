import Courses from '../../src/models/courses';
import { autorun } from 'mobx';
import { MASTER_COURSES_LIST } from '../courses-test-data';

describe('Course Model', () => {

  beforeEach(() => {
    Courses.bootstrap(MASTER_COURSES_LIST);
  });

  it('can be bootstrapped and size observed', () => {
    Courses.clear();
    const lenSpy = jest.fn();
    autorun(() => lenSpy(Courses.size));
    expect(lenSpy).toHaveBeenCalledWith(0);
    Courses.bootstrap(MASTER_COURSES_LIST);
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

  it('calculates audiance tags', () => {
    expect(Courses.get(1).tourAudianceTags).toEqual(['student']);
    expect(Courses.get(2).tourAudianceTags).toEqual(['teacher']);
    expect(Courses.get(3).tourAudianceTags).toEqual(['teacher', 'student']);
  });

});
