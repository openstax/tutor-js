import { bootstrapCoursesList } from '../../courses-test-data';
import TourRegion from '../../../src/components/tours/region';

import TourContext from '../../../src/models/tour/context';
jest.useFakeTimers();

describe('Tour Region', () => {
    beforeEach(() => {
        bootstrapCoursesList();
    });

    it('checks in with tour context when mounting/unmounting', () => {
        const context = new TourContext({ isEnabled: true, autoRemind: false });
        const wrapper = mount(
            <TourRegion id='teacher-calendar' courseId='2' tourContext={context}>
                <span>Hello</span>
            </TourRegion>
        );
        jest.runOnlyPendingTimers();
        expect(context.eligibleTours).toHaveLength(1);
        wrapper.unmount();
        expect(context.eligibleTours).toHaveLength(0);
    });
});
