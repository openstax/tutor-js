import { C, Factory } from '../../helpers';
import SupportMenu from '../../../src/components/navbar/support-menu';
import TourRegion from '../../../src/models/tour/region';
import TourContext from '../../../src/models/tour/context';
import Chat from '../../../src/models/chat';

jest.mock('../../../src/models/chat');
jest.mock('../../../src/models/user', () => ({
  tourAudienceTags: ['teacher'],
}));

describe('Support Menu', () => {
  let tourContext;
  let region;
  let props;
  beforeEach(() => {
    Chat.isEnabled = false;
    tourContext = new TourContext({ isEnabled: true });
    region = new TourRegion({ id: 'teacher-calendar', courseId: '2' });
    props = {
      tourContext,
      course: Factory.course(),
    };
  });

  it('only renders page tips option if available', () => {
    const menu = mount(<C withTours={tourContext}><SupportMenu  {...props} /></C>);
    expect(menu).not.toHaveRendered('.page-tips');
    region = new TourRegion({ id: 'foo', courseId: '2', otherTours: ['teacher-calendar'] });
    tourContext.openRegion(region);
    expect(tourContext.hasTriggeredTour).toBe(true);
    menu.find('button.dropdown-toggle').simulate('click');
    expect(menu).toHaveRendered('.page-tips');
    menu.unmount();
  });

  it('calls chat when clicked', () => {
    Chat.isEnabled = true;
    const menu = mount(<SupportMenu {...props} />);
    menu.find('button.dropdown-toggle').simulate('click');
    menu.find('.chat.enabled a').simulate('click');
    expect(Chat.start).toHaveBeenCalled();
    menu.unmount();
  });

  it('renders support links when in a course for student', () => {
    expect.snapshot(
      <C><SupportMenu {...props} /></C>
    ).toMatchSnapshot();
  });

  it('renders support links when in a course for teacher', () => {
    props.course.appearance_code = 'college_biology';
    expect.snapshot(<C><SupportMenu {...props} /></C>).toMatchSnapshot();
  });

  it('renders and matches snapshot', () => {
    tourContext.openRegion(region);
    // including the course here causes the snapshot to contain course dates and future runs to fail
    expect.snapshot(<C><SupportMenu tourContext={tourContext} /></C>).toMatchSnapshot();
  });

});
