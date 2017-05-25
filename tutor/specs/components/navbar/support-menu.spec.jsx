import { Wrapper, SnapShot } from '../helpers/component-testing';

import SupportMenu from '../../../src/components/navbar/support-menu';
import { bootstrapCoursesList } from '../../courses-test-data';
import TourRegion from '../../../src/models/tour/region';
import TourContext from '../../../src/models/tour/context';

describe('Support Menu', () => {
  let context;
  let region;
  beforeEach(() => {
    context = new TourContext({ isEnabled: true });
    region = new TourRegion({ id: 'teacher-calendar', courseId: '2' });
    bootstrapCoursesList();
  });

  it('only renders page tips option if available', () => {
    const menu = mount(<SupportMenu courseId="2" tourContext={context} />);
    expect(menu).not.toHaveRendered('.page-tips');
    region = new TourRegion({ id: 'foo', courseId: '2', otherTours: ['teacher-calendar'] });
    context.openRegion(region);
    expect(context.hasElgibleTour).toBe(true);
    expect(menu).toHaveRendered('.page-tips');
  });

  it('renders and matches snapshot', () => {
    context.openRegion(region);
    expect(SnapShot.create(
      <Wrapper _wrapped_component={SupportMenu} courseId="2" tourContext={context} />).toJSON()
    ).toMatchSnapshot();
  });


});
