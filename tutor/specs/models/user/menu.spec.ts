import { ld, Factory } from '../../helpers';
import UserMenu from '../../../src/models/user/menu';
import User from '../../../src/models/user';

const UntypedUser = User as any

jest.mock('../../../src/models/user', () => ({
    canCreateCourses: true,
    isConfirmedFaculty: true,
}));

describe('Current User Store', function() {

    it('computes help URL', () => {
        expect(UserMenu.helpURL).toContain('help');
    });

    it('should return expected menu routes when course is missing', () => {
        UntypedUser.canCreateCourses = true;
        expect.snapshot(UserMenu.getRoutes()).toMatchSnapshot();
    });

    it('should return expected menu routes for a teacher', () => {
        User.canCreateCourses = true;
        const course = Factory.course({ is_teacher: true });
        expect(course.currentRole.isTeacher).toBe(true);
        expect.snapshot(UserMenu.getRoutes(course)).toMatchSnapshot();
    });

    it('should return expected menu routes for a student', () => {
        User.canCreateCourses = false;
        const course = Factory.course({ is_teacher: false });
        expect(course.currentRole.isTeacher).toBe(false);
        expect.snapshot(UserMenu.getRoutes(course)).toMatchSnapshot();
    });

    it('hides course creation from non- faculty', () => {
        User.canCreateCourses = false;
        const course = Factory.course({ is_teacher: true });
        const options = ld.map(UserMenu.getRoutes(course), 'name');
        expect(options).not.toContain('createNewCourse');
        expect(options).not.toContain('cloneCourse');
    });
});
