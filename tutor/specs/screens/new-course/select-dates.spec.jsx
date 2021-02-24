import { React, Factory, TimeMock } from '../../helpers';
import SelectDates from '../../../src/screens/new-course/select-dates';
import BuilderUX from '../../../src/screens/new-course/ux';

jest.mock('../../../src/models/user', () => ({
    canCreateCourses: true,
}));

describe('CreateCourse: Selecting course dates', function() {
    let ux;

    TimeMock.setTo('2018-12-01T12:00:00.000Z');

    beforeEach(() => {
        ux = new BuilderUX({
            router: { match: { params: {} } },
            courses: Factory.coursesMap({ count: 1 }),
            offerings: Factory.offeringsMap({ count: 4 }),
        });
        ux.newCourse.offering = ux.offerings.array[0];
    });

    it('it sets state when date row is clicked', async function() {
        const wrapper = mount(<SelectDates ux={ux} />);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        wrapper.find('.list-group-item').at(0).simulate('click');
        expect(ux.newCourse.term).toEqual(
            ux.newCourse.offering.active_term_years[0]
        );
    });

    it('matches snapshot', function() {
        expect.snapshot(<SelectDates ux={ux} />).toMatchSnapshot();
    });
});
