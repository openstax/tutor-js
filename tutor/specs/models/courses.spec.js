import Courses from '../../src/models/courses';
import { autorun } from 'mobx';
import { MASTER_COURSES_LIST } from '../courses-test-data';

describe('Course Model', () => {

  it('can be bootstrapped and size observed', () => {
    const lenSpy = jest.fn();
    autorun(() => lenSpy(Courses.size));
    expect(lenSpy).toHaveBeenCalledWith(0);
    Courses.bootstrap(MASTER_COURSES_LIST);
    expect(lenSpy).toHaveBeenCalledWith(3);
    expect(Courses.size).toEqual(3);
  });

});
