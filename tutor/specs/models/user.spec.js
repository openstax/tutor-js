import { autorun } from 'mobx';

import User from '../../src/models/user';
import { UserTerms } from '../../src/models/user/terms';
import Courses from '../../src/models/courses-map';
import UiSettings from 'shared/model/ui-settings';

import USER_DATA from '../../api/user.json';
import { bootstrapCoursesList } from '../courses-test-data';

describe('User Model', () => {
  afterEach(() => {
    User.viewed_tour_stats.clear();
  });

  it('can be bootstrapped', () => {
    const spy = jest.fn();
    autorun(() => spy(User.name));
    expect(spy).toHaveBeenCalledWith(undefined);
    User.bootstrap(USER_DATA);
    expect(spy).toHaveBeenCalledWith(USER_DATA.name);
    expect(User.terms).toBeInstanceOf(UserTerms);
  });

  it('calculates audience tags', () => {
    bootstrapCoursesList();
    expect(User.tourAudienceTags).toEqual(['teacher', 'teacher-not-previewed']);
    const course = Courses.get(2);
    course.is_preview = true;
    UiSettings.set('DBVC', course.id, 1);

    expect(User.tourAudienceTags).toEqual(['teacher']);

    Courses.forEach((c) => { c.trackDashboardView(); });
    expect(User.tourAudienceTags).toEqual(['teacher']);

    Courses.forEach((c) => {
      c.appearance_code = 'intro_sociology';
    });
    expect(User.tourAudienceTags).toEqual(['teacher']);

    Courses.clear();
    expect(User.tourAudienceTags).toEqual([]);
  });

  it('#verifiedRoleForCourse', () => {
    bootstrapCoursesList();
    expect(User.verifiedRoleForCourse(Courses.get(1))).toEqual('student');
    User.can_create_courses = true;
    expect(User.verifiedRoleForCourse(Courses.get(2))).toEqual('student');
    User.faculty_status = 'confirmed_faculty';
    expect(User.verifiedRoleForCourse(Courses.get(2))).toEqual('teacher');
  });

  it('#recordSessionStart', () => {
    const spy = jest.spyOn(UiSettings, 'set');

    User.recordSessionStart();
    expect(UiSettings.set).toHaveBeenCalled();
    expect(UiSettings.set).toHaveBeenCalledWith('sessionCount', 1);

    spy.mockReset();
    spy.mockRestore();
  });

  it('#isProbablyTeacher', () => {
    User.faculty_status = 'nope';
    User.can_create_courses = false;
    User.self_reported_role = 'student';
    Courses.clear();
    expect(User.isProbablyTeacher).toBe(false);
    bootstrapCoursesList();
    expect(User.isProbablyTeacher).toBe(true);
    expect(User.canViewPreviewCourses).toBe(false);
    Courses.clear();
    User.can_create_courses = false;
    User.self_reported_role = 'instructor';
    expect(User.isProbablyTeacher).toBe(true);
    expect(User.canViewPreviewCourses).toBe(false);
    User.can_create_courses = true;
    expect(User.canViewPreviewCourses).toBe(true);
  });

  it('#logEvent', () => {
    User.self_reported_role = 'student';
    const ev = { category: 'test', code: 'test', data: {} };
    expect(User.logEvent(ev)).toEqual('ABORT');
    User.self_reported_role = 'teacher';
    expect(User.logEvent(ev)).toEqual(ev);
  });

  it('checks for names then splits', () => {
    User.name = 'Sir Alex Williams IV';
    User.first_name = User.last_name = '';
    expect(User.initials).toEqual('S I');
    User.first_name = 'Bob';
    expect(User.firstName).toEqual('Bob');
    User.last_name = 'Smith';
    expect(User.lastName).toEqual('Smith');
    expect(User.initials).toEqual('B S');
  });

});
