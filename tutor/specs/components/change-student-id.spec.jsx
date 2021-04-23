import { TutorRouter, R, C, Factory, runInAction } from '../helpers';
import { currentCourses } from '../../src/models';
import ChangeStudentId from '../../src/components/change-student-id';

jest.mock('../../src/helpers/router');

describe('Change Student ID', () => {
    let params, courses;

    beforeEach(() => {
        params = { courseId: '1' };
        const course = Factory.course();
        courses = currentCourses.bootstrap([course]);
        TutorRouter.currentParams.mockReturnValue(params);
        TutorRouter.makePathname.mockReturnValue('go-to-dash');
    });

    it('renders and matches snapshot for various states', () => {
        const course = courses.get(params.courseId);
        runInAction(() => course.userStudentRecord.student_identifier = '1234');
        expect.snapshot(<R><ChangeStudentId /></R>).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const wrapper = mount(<R><ChangeStudentId /></R>);
        wrapper.unmount();
    });

    it('updates student id when edited', async () => {
        const course = courses.get(params.courseId);
        course.userStudentRecord.saveOwnStudentId = jest.fn(() => Promise.resolve({}));
        const wrapper = mount(<R><ChangeStudentId /></R>);
        wrapper.find('input').at(0).getDOMNode().value = 'MY-NEW-ID';

        wrapper.find('.btn-primary').simulate('click');
        expect(course.userStudentRecord.student_identifier).toEqual('MY-NEW-ID');
        expect(course.userStudentRecord.saveOwnStudentId).toHaveBeenCalled();
        wrapper.unmount();
    });

    it('navigates to dashboard when clicked', () => {
        const form = mount(<C><ChangeStudentId /></C>);
        form.find('.btn.cancel').simulate('click');
        expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', params);
        expect(form.instance().pathname).toEqual('/go-to-dash');
    });

    it('warns when invalid', () => {
        const form = mount(<R><ChangeStudentId /></R>);
        form.find('input').simulate('keyUp', { target: { value: '' } });
        expect(form).toHaveRendered('.invalid-warning');
    });
});
