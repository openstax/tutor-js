import { Factory, C, EnzymeContext } from '../../helpers';
import Helper from '../../../src/screens/teacher-dashboard/helper';
import Sidebar from '../../../src/screens/teacher-dashboard/add-assignment-sidebar';

jest.mock('../../../src/screens/teacher-dashboard/helper');

describe('CourseCalendar AddAssignmentMenu', function() {
  let props = {};

  beforeEach(() => {
    props = {
      course: Factory.course({ is_teacher: true }),
      onSidebarToggle: jest.fn(),
      isOpen: false,
      shouldIntro: false,
      hasPeriods: true,
    };
  });

  it('renders with style for periods', function() {
    const wrapper = mount(<C><Sidebar {...props} /></C>);
    const links = wrapper.find('.new-assignments li').map(el => el.render().text());
    expect(links).toEqual([
      'Add Reading',
      'Add Homework',
      'Add External Assignment',
      'Add Event',
    ]);
  });


  it('set state as events are called', function() {
    Helper.shouldIntro.mockImplementation(() => true);
    const wrapper = mount(<Sidebar {...props} />, EnzymeContext.withDnD());
    expect(Helper.scheduleIntroEvent).not.toHaveBeenCalled();
    wrapper.setState({ willShowIntro: true });
    wrapper.setProps({ isOpen: true });

    expect(Helper.scheduleIntroEvent).toHaveBeenCalled();
    expect(wrapper.state('showIntro')).toBeUndefined();
    Helper.scheduleIntroEvent.mock.calls[0][0]();
    expect(wrapper.instance().shouldShowIntro).toBe(true);
    wrapper.unmount();
    expect(Helper.clearScheduledEvent).toHaveBeenCalled();
  });


  it('clears timeout on unmount', function() {
    Helper.scheduleIntroEvent.mockReturnValueOnce('one');
    const wrapper = mount(<Sidebar {...props} />, EnzymeContext.withDnD());
    wrapper.setState({ willShowIntro: true });
    wrapper.setProps({ isOpen: true });
    expect(Helper.scheduleIntroEvent).toHaveBeenCalled();
    wrapper.unmount();
    expect(Helper.clearScheduledEvent).toHaveBeenCalledWith('one');
  });

});
