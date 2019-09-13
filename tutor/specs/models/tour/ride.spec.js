import { bootstrapCoursesList } from '../../courses-test-data';
import TourContext from '../../../src/models/tour/context';
import TourRegion from '../../../src/models/tour/region';

describe('Tour Ride Model', () => {
  let context;
  let region;
  let ride;

  beforeEach(() => {
    bootstrapCoursesList();
    context = new TourContext({ isEnabled: true });
    region = new TourRegion({ id: 'teacher-calendar', courseId: '2', tour_ids: ['teacher-calendar'] });
    context.openRegion(region);
    context.playTriggeredTours();
    ride = context.tourRide;
  });

  it('calculates props for joyride', () => {
    expect(ride.props).toMatchObject({
      ride: ride,
      step: ride.validSteps[0],
    });
    ride.tour.steps[0].anchor_id = null;
    expect(ride.props.step).toBe(ride.validSteps[0]);
    expect(ride.validSteps).toHaveLength(1);
  });

  it ('calculates if steps should show progress', () => {
    ride.tour.steps.forEach((s) => s.anchor_id = null);
    expect(ride.validSteps).toHaveLength(ride.tour.steps.length);
    expect(ride.showStepsProgress).toBe(true);
    ride.tour.steps.forEach((s) => s.anchor_id = '1234');
    jest.spyOn(document, 'querySelector').mockImplementation(() => false);
    expect(ride.showStepsProgress).toBe(false);
  });

});
