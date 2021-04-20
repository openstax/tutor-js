import { ApiMock, React, Factory } from '../../helpers';
import SelectCourse from '../../../src/screens/new-course/select-course';
import BuilderUX from '../../../src/screens/new-course/ux';


jest.mock('../../../src/models/user', () => ({
    currentUser: {
        canCreateCourses: true,
    },
}));

describe('CreateCourse: Selecting course subject', function() {
    ApiMock.intercept({
        'offerings': { items: [Factory.data('Offering', { id: 1, title: 'Test Offering' })] },
    })

    let ux;
    beforeEach(() => {
        ux = new BuilderUX({
            router: { match: { params: {} } },
            offerings: Factory.offeringsMap({ count: 4 }),
        });
    });

    it('it sets offering_id when clicked', async function() {
        const wrapper = mount(<SelectCourse ux={ux} />);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        expect(ux.newCourse.offering_id).toEqual('');
        wrapper.find('Choice').at(2).simulate('click');
        expect(ux.newCourse.offering_id).toEqual(ux.offerings.array[2].id);
    });

    it('matches snapshot', function() {
        expect.snapshot(<SelectCourse ux={ux} />).toMatchSnapshot();
    });

});
