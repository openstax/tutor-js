import { SnapShot } from '../helpers/component-testing';
import ToursReplay from '../../../src/components/navbar/tours-replay';
import TourContext from '../../../src/models/tour/context';

describe('Tours Replay Icon', () => {
  it ('toggles is-visible based on context', () => {
    const context = new TourContext();
    const icon = mount(<ToursReplay tourContext={context} />);
    expect(icon.hasClass('is-visible')).toBe(false);
    context.forcePastToursIndication = true;
    expect(icon.hasClass('is-visible')).toBe(true);
  });

  it('renders and matches snapshot', () => {
    const context = new TourContext();
    context.forcePastToursIndication = true;
    expect(SnapShot.create(
      <ToursReplay tourContext={context} />).toJSON()
    ).toMatchSnapshot();
  });
});
