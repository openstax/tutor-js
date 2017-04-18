import { autorun } from 'mobx';

import User from '../../src/models/user';
import Courses from '../../src/models/courses-map';

import USER_DATA from '../../api/user.json';
import { bootstrapCoursesList } from '../courses-test-data';

describe('User Model', () => {
  afterEach(() => {
    User.viewed_tour_ids.clear();
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
    expect(User.tourAudienceTags).toEqual([]); // currently user tags are always empty
  });

  it('#verifiedRoleForCourse', () => {
    bootstrapCoursesList();
    expect(User.verifiedRoleForCourse(Courses.get(2))).toEqual('student');
    User.faculty_status = 'confirmed_faculty';
    expect(User.verifiedRoleForCourse(Courses.get(2))).toEqual('teacher');
  });

});
