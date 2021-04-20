import { ApiMock, C, React, Factory } from '../../helpers';
import CourseNumbers from '../../../src/screens/new-course/course-numbers';
import BuilderUX from '../../../src/screens/new-course/ux';

jest.mock('../../../src/models/user', () => ({
    currentUser: {
        canCreateCourses: true,
    },
}));

describe('CreateCourse: entering details', function() {

    let ux;
    ApiMock.intercept({
        'offerings': { items: [Factory.data('Offering', { id: 1, title: 'Test Offering' })] },
    })

    beforeEach(() => {
        ux = new BuilderUX({
            router: { match: { params: {} } },
            courses: Factory.coursesMap({ count: 1 }),
            offerings: Factory.offeringsMap({ count: 4 }),
        });
    });

    it('is accessible', async () => {
        const wrapper = mount(<C><CourseNumbers ux={ux} /></C>);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        wrapper.unmount();
    });

    it('sets field values', function() {
        ux.newCourse.cloned_from = ux.courses.array[0];
        const wrapper = shallow(<CourseNumbers ux={ux} />);
        expect(wrapper).toHaveRendered('[id="number-students"]');
        wrapper.unmount();
    });

    it('shows errors', () => {
        const wrapper = mount(<C><CourseNumbers ux={ux} /></C>);
        wrapper.find('FormControl[id="number-students"] input')
            .simulate('change', { target: { value: 3000 } });
        expect(wrapper.text()).toContain(
            'More than 1500 students is not supported'
        );
        expect(wrapper.text()).toContain('Need more');

        wrapper.find('FormControl[id="number-students"] input')
            .simulate('change', { target: { value: 0 } });
        expect(wrapper.text()).toContain(
            'Less than 1 student is not supported'
        );
        expect(wrapper.text()).not.toContain('Need more');
        wrapper.unmount();
    });

    it('updates values when edited', function() {
        const wrapper = mount(<C><CourseNumbers ux={ux} /></C>);
        wrapper.find('FormControl[id="number-students"] input')
            .simulate('change', { target: { value: 3 } });
        wrapper.find('FormControl[id="number-sections"] input')
            .simulate('change', { target: { value: 12 } });
        expect(ux.newCourse.estimated_student_count).toEqual(3);
        expect(ux.newCourse.num_sections).not.toEqual(12);
        wrapper.find('.course-details-sections .form-control')
            .simulate('change', { target: { value: 3 } });
        expect(ux.newCourse.num_sections).toEqual(3);
        wrapper.unmount();
    });

    it('matches snapshot', function() {
        expect.snapshot(<C><CourseNumbers ux={ux} /></C>).toMatchSnapshot();
    });
});
