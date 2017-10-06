import { autorun } from 'mobx';

import User from '../../src/models/user';
import Courses from '../../src/models/courses-map';
import UiSettings from 'shared/src/model/ui-settings';

import USER_DATA from '../../api/user.json';
import { bootstrapCoursesList } from '../courses-test-data';

jest.mock('shared/src/model/ui-settings');

describe('User Model', () => {
  afterEach(() => {
    User.viewed_tour_stats.clear();
  });

  it('has terms', () => {
    expect(User.terms.api.isPending).toBe(false);
  });

  it('can be bootstrapped', () => {
    const spy = jest.fn();
    autorun(() => spy(User.name));
    expect(spy).toHaveBeenCalledWith(undefined);
    User.bootstrap(USER_DATA);
    expect(spy).toHaveBeenCalledWith(USER_DATA.name);
  });

  it('calculates audience tags', () => {
    bootstrapCoursesList();
    expect(User.tourAudienceTags).toEqual(['teacher', 'teacher-no-coach']);
    Courses.forEach((c) => (c.is_preview = true));
    expect(User.tourAudienceTags).toEqual(['teacher-preview']);
    Courses.forEach((c) => {
      c.is_concept_coach = true;
      c.is_preview = false;
    });
    expect(User.tourAudienceTags).toEqual(['teacher', 'teacher-coach-no-migration']);
    Courses.forEach((c) => {
      c.appearance_code = 'intro_sociology';
    });
    expect(User.tourAudienceTags).toEqual(['teacher', 'teacher-coach-with-migration']);
    Courses.clear();
    expect(User.tourAudienceTags).toEqual([]);
  });

  it('#verifiedRoleForCourse', () => {
    bootstrapCoursesList();
    expect(User.verifiedRoleForCourse(Courses.get(2))).toEqual('student');
    User.faculty_status = 'confirmed_faculty';
    expect(User.verifiedRoleForCourse(Courses.get(2))).toEqual('teacher');
  });

  it('#recordSessionStart', () => {
    User.recordSessionStart();
    expect(UiSettings.set).toHaveBeenCalled();
    expect(UiSettings.set).toHaveBeenCalledWith('sessionCount', 1);
  });

  it('#isProbablyTeacher', () => {
    User.faculty_status = 'nope';
    User.self_reported_role = 'student';
    Courses.clear();
    expect(User.isProbablyTeacher).toBe(false);
    bootstrapCoursesList();
    expect(User.isProbablyTeacher).toBe(true);
    Courses.clear();
    User.faculty_status = 'confirmed_faculty';
    expect(User.isProbablyTeacher).toBe(true);
  });

  it('#logEvent', () => {
    User.self_reported_role = 'student';
    const ev = { category: 'test', code: 'test', data: {} };
    expect(User.logEvent(ev)).toEqual('ABORT');
    User.self_reported_role = 'teacher';
    expect(User.logEvent(ev)).toEqual(ev);
  });

});
