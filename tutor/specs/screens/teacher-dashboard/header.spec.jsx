import Header from '../../../src/screens/teacher-dashboard/header';
import Factory from '../../factories';
import moment from 'moment';

describe('CourseCalendar Header', function() {
    let course;
    let props = {};

    beforeEach(() => {
        course = Factory.course();
        props = {
            course,
            duration: 'month',
            setDate: jest.fn(),
            date: moment(),
            format: 'MMMM YYYY',
            hasPeriods: true,
            onSidebarToggle: jest.fn(),
        };
    });

    it('renders with links', function() {
        const wrapper = shallow(<Header {...props} />);
        expect(wrapper).toHaveRendered('TutorLink[to="viewPerformanceGuide"]');
        expect(wrapper).toHaveRendered('TutorLink[to="viewGradebook"]');
    });
});
