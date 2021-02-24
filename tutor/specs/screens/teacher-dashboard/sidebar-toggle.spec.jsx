import { React } from '../../helpers';
import Factory from '../../factories';
import Helper from '../../../src/screens/teacher-dashboard/helper';
import Toggle from '../../../src/screens/teacher-dashboard/sidebar-toggle';

jest.mock('../../../src/screens/teacher-dashboard/helper');

describe('CourseCalendar Sidebar Toggle', function() {
    let course;
    let props = {};

    beforeEach(() => {
        course = Factory.course();
        props = {
            course,
            onToggle: jest.fn(),
        };
    });

    it('renders and toggles', function() {
        const wrapper = shallow(<Toggle {...props} />);
        expect(wrapper.hasClass('open')).toEqual(false);
        wrapper.simulate('click');
        expect(wrapper.hasClass('open')).toEqual(true);
        expect(props.onToggle).toHaveBeenCalledWith(true);
    });

    it('schedules and then clears timeout on unmount', function() {
        Helper.scheduleIntroEvent.mockReturnValueOnce(42);
        const wrapper = shallow(<Toggle {...props} />);
        expect(Helper.scheduleIntroEvent).toHaveBeenCalled();
        wrapper.unmount();
        expect(Helper.clearScheduledEvent).toHaveBeenCalledWith(42);
    });

    it('stores per-course state using helper', function() {
        const wrapper = shallow(<Toggle {...props} />);
        wrapper.simulate('click');
        expect(Helper.setSidebarOpen).toHaveBeenCalledWith(course, true);
    });

    it('displays the correct icon after animation finishes', function() {
        const wrapper = shallow(<Toggle {...props} />);
        expect(wrapper.hasClass('open')).toEqual(false);
        wrapper.simulate('click');
        expect(wrapper.find('Icon[type="bars"]').length).toEqual(1);
        wrapper.simulate('transitionEnd');
        expect(wrapper.find('Icon[type="close"]').length).toEqual(1);
    });

    it('defaults to last opened value', function() {
        Helper.isSidebarOpen.mockReturnValueOnce(true);
        const wrapper = shallow(<Toggle {...props} />);
        expect(wrapper.hasClass('open')).toEqual(true);
        expect(wrapper.find('Icon[type="close"]').length).toEqual(1);
    });

    it('matches snapshot', function() {
        expect.snapshot(<Toggle {...props} />).toMatchSnapshot();
    });
});
