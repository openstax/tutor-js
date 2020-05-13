import { Factory, C } from '../../helpers';
import Sidebar from '../../../src/screens/teacher-dashboard/sidebar';

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
      'Grading Templates',
    ]);
  });

});
