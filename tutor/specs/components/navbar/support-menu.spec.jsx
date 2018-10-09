import { Wrapper, SnapShot } from '../helpers/component-testing';
import SupportMenu from '../../../src/components/navbar/support-menu';
import { bootstrapCoursesList } from '../../courses-test-data';

import TourRegion from '../../../src/models/tour/region';
import TourContext from '../../../src/models/tour/context';
import Chat from '../../../src/models/chat';
import User from '../../../src/models/user';
jest.mock('../../../src/models/chat');
jest.mock('../../../src/models/user');

describe('Support Menu', () => {
  let context;
  let region;
  let courses;
  beforeEach(() => {
    Chat.isEnabled = false;
    context = new TourContext({ isEnabled: true });
    region = new TourRegion({ id: 'teacher-calendar', courseId: '2' });
    courses = bootstrapCoursesList();
  });

  it('only renders page tips option if available', () => {
    const menu = mount(<SupportMenu courseId="2" tourContext={context} />);
    expect(menu).not.toHaveRendered('.page-tips');
    region = new TourRegion({ id: 'foo', courseId: '2', otherTours: ['teacher-calendar'] });
    context.openRegion(region);
    expect(context.hasTriggeredTour).toBe(true);
    expect(menu).toHaveRendered('.page-tips');
    menu.unmount();
  });

  it('calls chat when clicked', () => {
    Chat.isEnabled = true;
    const menu = mount(<SupportMenu courseId="2" tourContext={context} />);
    menu.find('.chat.enabled a').simulate('click');
    expect(Chat.start).toHaveBeenCalled();
    menu.unmount();
  });

  it('renders support links when in a course for student', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={SupportMenu} courseId="1" tourContext={context} />).toJSON()
    ).toMatchSnapshot();
  });

  it('renders support links when in a course for teacher', () => {
    courses.get('2').appearance_code = 'college_biology';
    expect(SnapShot.create(
      <Wrapper _wrapped_component={SupportMenu} courseId="2" tourContext={context} />).toJSON()
    ).toMatchSnapshot();
  });

  it('renders and matches snapshot', () => {
    context.openRegion(region);
    expect(SnapShot.create(
      <Wrapper _wrapped_component={SupportMenu} courseId="2" tourContext={context} />).toJSON()
    ).toMatchSnapshot();
  });

  it('links to student preview with course', () => {
    courses.get('2').appearance_code = 'college_biology';
    User.isConfirmedFaculty = true;
    const menu = mount(<Wrapper _wrapped_component={SupportMenu} courseId="2" tourContext={context} />);
    const selector = '[data-tour-anchor-id="student-preview-link"]';
    expect(menu).toHaveRendered(selector);
    menu.find(selector).simulate('click');
    expect(menu.find('Router').props().history.location.pathname).toEqual('/student-preview/2');
    menu.unmount();
  });

});
