import { SnapShot } from '../helpers/component-testing';
import TourRegion from '../../../src/models/tour/region';
import ToursReplay from '../../../src/components/navbar/tours-replay';
import TourContext from '../../../src/models/tour/context';
import { bootstrapCoursesList } from '../../courses-test-data';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user', () => ({
  replayTour: jest.fn(),
}));


describe('Tours Replay Icon', () => {
  let context;
  let region;
  beforeEach(() => {
    context = new TourContext({ isEnabled: true });
    region = new TourRegion({ id: 'teacher-calendar', courseId: '2' });
    bootstrapCoursesList();
  });

  it ('clears viewed tours when clicked', () => {
    const icon = mount(<ToursReplay tourContext={context} />);
    expect(icon).toHaveRendered('.tours-replay');
    expect(icon).not.toHaveRendered('.tours-replay.is-visible');
    context.openRegion(region);
    expect(icon).toHaveRendered('.tours-replay.is-visible');

    icon.simulate('click');
    expect(User.replayTour).toHaveBeenCalled();
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(<ToursReplay tourContext={context} />).toJSON()).toMatchSnapshot();
    context.openRegion(region);
    expect(SnapShot.create(<ToursReplay tourContext={context} />).toJSON()).toMatchSnapshot();
  });
});
