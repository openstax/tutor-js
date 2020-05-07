import { ld, Factory } from '../../helpers';
import UserMenu from '../../../src/models/user/menu';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user', () => ({
  isAllowedInstructor: true,
  isConfirmedFaculty: true,
}));

describe('Current User Store', function() {

  it('computes help URL', () => {
    expect(UserMenu.helpURL).toContain('help');
  });

  it('should return expected menu routes when course is missing', () => {
    User.isConfirmedFaculty = true;
    expect.snapshot(UserMenu.getRoutes()).toMatchSnapshot();
  });

  it('should return expected menu routes for a teacher', () => {
    User.isConfirmedFaculty = true;
    const course = Factory.course({ is_teacher: true });
    expect(course.currentRole.isTeacher).toBe(true);
    expect.snapshot(UserMenu.getRoutes(course)).toMatchSnapshot();
  });

  it('should return expected menu routes for a student', () => {
    User.isConfirmedFaculty = false;
    const course = Factory.course({ is_teacher: false });
    expect(course.currentRole.isTeacher).toBe(false);
    expect.snapshot(UserMenu.getRoutes(course)).toMatchSnapshot();
  });

  it('hides course creation from non-college faculty', () => {
    User.isAllowedInstructor = false;
    const course = Factory.course({ is_teacher: true });
    const options = ld.map(UserMenu.getRoutes(course), 'name');
    expect(options).not.toContain('createNewCourse');
    expect(options).not.toContain('cloneCourse');
  });
});
