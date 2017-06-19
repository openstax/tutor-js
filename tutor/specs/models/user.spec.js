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

  it('can be bootstrapped', () => {
    const spy = jest.fn();
    autorun(() => spy(User.name));
    expect(spy).toHaveBeenCalledWith(undefined);
    User.bootstrap(USER_DATA);
    expect(spy).toHaveBeenCalledWith(USER_DATA.name);
  });

  it('calculates audience tags', () => {
    bootstrapCoursesList();
    expect(User.tourAudienceTags).toEqual(['teacher']);
    Courses.forEach((c) => (c.is_preview = true));
    expect(User.tourAudienceTags).toEqual(['teacher-preview']);
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

});
