import { autorun } from 'mobx';
import Courses from '../../src/models/courses';
import { MASTER_COURSES_LIST } from '../courses-test-data';

import User from '../../src/models/user';

import USER_DATA from '../../api/user.json';

describe('Course Model', () => {

  it('can be bootstrapped', () => {
    const spy = jest.fn();
    autorun(() => spy(User.name));
    expect(spy).toHaveBeenCalledWith(undefined);
    User.bootstrap(USER_DATA);
    expect(spy).toHaveBeenCalledWith(USER_DATA.name);
  });

  it('calculates audiance tags', () => {
    Courses.bootstrap(MASTER_COURSES_LIST);
    expect(User.audianceTagsForCourse(Courses.get(1))).toEqual(['student']);
    expect(User.audianceTagsForCourse(Courses.get(2))).toEqual(['teacher']);
    expect(User.audianceTagsForCourse(Courses.get(3))).toEqual(['teacher', 'student']);
  });
});
