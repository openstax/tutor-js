import { Factory } from '../../helpers';

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
