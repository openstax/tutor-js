import { bootstrapCoursesList } from '../../courses-test-data';
import TourContext from '../../../src/models/tour/context';
import TourRegion from '../../../src/models/tour/region';
import TourRide from '../../../src/models/tour/ride';
import { hydrateModel } from 'modeled-mobx';
import { runInAction } from 'mobx';

describe('Tour Ride Model', () => {
    let context: TourContext;
    let region:TourRegion;
    let ride:TourRide;

    beforeEach(() => {
        bootstrapCoursesList();
        runInAction(() => {
            context = hydrateModel(TourContext, { isEnabled: true })
            region = hydrateModel(TourRegion, { id: 'teacher-calendar', courseId: '2' })
            context.openRegion(region);
            context.playTriggeredTours();
            ride = context.tourRide!;
        })
    });

    it('calculates props for joyride', () => {
        expect(ride.props).toMatchObject({
            ride: ride,
            step: ride.validSteps[0],
        });
        runInAction(() => {
            ride.tour.steps[0].anchor_id = null;
        })
        expect(ride.props.step).toBe(ride.validSteps[0]);
        expect(ride.validSteps).toHaveLength(1);
    });

    it ('calculates if steps should show progress', () => {
        runInAction(() => {
            ride.tour.steps.forEach((s) => s.anchor_id = null);
        })
        expect(ride.validSteps).toHaveLength(ride.tour.steps.length);
        expect(ride.hasMultipleSteps).toBe(true);
        runInAction(() => {
            ride.tour.steps.forEach((s) => s.anchor_id = '1234');
        })
        jest.spyOn(document, 'querySelector').mockImplementation(() => null);
        expect(ride.hasMultipleSteps).toBe(false);
    });

});
