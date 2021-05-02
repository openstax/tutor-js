import { currentUser, UserMenu } from '../../../src/models'
import { ld, Factory } from '../../helpers';

jest.mock('../../../src/models/user', () => ({
    currentUser: {
        canCreateCourses: true,
        isConfirmedFaculty: true,

    },
}));

const UntypedUser = currentUser as any

describe('Current User Store', function() {

    fit('computes help URL', () => {
        expect(UserMenu.helpURL).toContain('help');
    });

    it('should return expected menu routes when course is missing', () => {
        UntypedUser.canCreateCourses = true;
        // @ts-ignore
        expect.snapshot(UserMenu.getRoutes()).toMatchSnapshot();
    });

    it('should return expected menu routes for a teacher', () => {
        UntypedUser.canCreateCourses = true;
        const course = Factory.course({ is_teacher: true });
        expect(course.currentRole.isTeacher).toBe(true);
        // @ts-ignore
        expect.snapshot(UserMenu.getRoutes(course)).toMatchSnapshot();
    });

    it('should return expected menu routes for a student', () => {
        UntypedUser.canCreateCourses = false;
        const course = Factory.course({ is_teacher: false });
        expect(course.currentRole.isTeacher).toBe(false);
        // @ts-ignore
        expect.snapshot(UserMenu.getRoutes(course)).toMatchSnapshot();
    });

    it('hides course creation from non- faculty', () => {
        UntypedUser.canCreateCourses = false;
        const course = Factory.course({ is_teacher: true });
        const options = ld.map(UserMenu.getRoutes(course), 'name');
        expect(options).not.toContain('createNewCourse');
        expect(options).not.toContain('cloneCourse');
    });
});
