import { Factory } from '../../helpers';
import { autorun } from 'mobx';
import Roster from '../../../src/models/course/roster';


describe('Roster Model', function() {
  let course;

  beforeEach(() => {
    course = Factory.course();
  });

  it('loads active', () => {
    expect(course.roster.teachers).toHaveLength(0);
    Factory.courseRoster({ course });
    expect(course.roster.teachers).toHaveLength(2);
    expect(course.roster.teachers.active).toEqual(
      course.roster.teachers
    );
  });

});
