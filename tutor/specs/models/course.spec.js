import { map, clone, shuffle } from 'lodash';
import Courses from '../../src/models/courses-map';
import Course from '../../src/models/course';
import PH from '../../src/helpers/period';

import { autorun } from 'mobx';
import { bootstrapCoursesList } from '../courses-test-data';

import COURSE from '../../api/courses/1.json';

jest.mock('shared/src/model/ui-settings');

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

  it('#userStudentRecord', () => {
    expect(Courses.get(1).userStudentRecord).not.toBeNull();
    expect(Courses.get(1).userStudentRecord.student_identifier).toEqual('1234');
    expect(Courses.get(2).userStudentRecord).toBeNull();
  });

  it('calculates audience tags', () => {
    expect(Courses.get(1).tourAudienceTags).toEqual(['student']);
    const teacher = Courses.get(2);
    expect(teacher.tourAudienceTags).toEqual(['teacher', 'teacher-settings-roster-split']);

    teacher.is_preview = true;
    expect(teacher.tourAudienceTags).toEqual(['teacher-preview']);
    const course = Courses.get(3);
    expect(course.tourAudienceTags).toEqual(['teacher', 'student']);
    course.is_preview = false;
    expect(course.isTeacher).toEqual(true);
    course.taskPlans.set('1', { id: 1, type: 'reading', is_publishing: true, isPublishing: true });
    expect(course.taskPlans.reading.hasPublishing).toEqual(true);
    expect(course.tourAudienceTags).toEqual(['teacher', 'teacher-reading-published', 'student' ]);

  });


  it('should return expected roles for courses', function() {
    expect(Courses.get(1).primaryRole.type).to.equal('student');
    expect(Courses.get(2).primaryRole.type).to.equal('teacher');
    expect(Courses.get(3).primaryRole.type).to.equal('teacher');
    expect(Courses.get(1).primaryRole.joinedAgo('days')).toEqual(7);
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

  it('restricts joining to links', () => {
    const course = Courses.get(2);
    expect(course.is_lms_enabling_allowed).toEqual(false);
    expect(course.canOnlyUseEnrollmentLinks).toEqual(true);
    course.is_lms_enabling_allowed = true;
    expect(course.canOnlyUseEnrollmentLinks).toEqual(false);
    course.is_lms_enabled = true;
    course.is_access_switchable = false;
    expect(course.canOnlyUseEnrollmentLinks).toEqual(false);
    expect(course.canOnlyUseLMS).toEqual(true);
    course.is_lms_enabled = false;
    expect(course.canOnlyUseEnrollmentLinks).toEqual(true);
    expect(course.canOnlyUseLMS).toEqual(false);
  });

  it('extends periods', () => {
    const data = clone(COURSE);
    data.periods = shuffle(data.periods);
    jest.spyOn(PH, 'sort');

    const course = new Course(data);
    const len = course.periods.length;

    expect(map(course.periods, 'id')).not.toEqual(
      map(course.periods.sorted, 'id')
    );
    expect(PH.sort).toHaveBeenCalledTimes(1);

    const sortedSpy = jest.fn(() => course.periods.sorted);
    autorun(sortedSpy);

    expect(course.periods.sorted).toHaveLength(len);
    expect(sortedSpy).toHaveBeenCalledTimes(1);
    expect(PH.sort).toHaveBeenCalledTimes(2);

    course.periods.pop();
    expect(course.periods.length).toEqual(len - 1);
    expect(course.periods.sorted.length).toEqual(len - 1);

    expect(PH.sort).toHaveBeenCalledTimes(3);
    expect(sortedSpy).toHaveBeenCalledTimes(2);
    expect(map(course.periods, 'id')).not.toEqual(
      map(course.periods.sorted, 'id')
    );
    expect(PH.sort).toHaveBeenCalledTimes(3);
    expect(sortedSpy).toHaveBeenCalledTimes(2);
  });

  it('calculates if terms are before', () => {
    const course = Courses.get(2);
    expect(course.isBeforeTerm('spring', 2013)).toBe(false);
    expect(course.isBeforeTerm('spring', (new Date()).getFullYear()+1)).toBe(true);
    expect(course.isBeforeTerm(course.term, course.year)).toBe(false);
  });

});
