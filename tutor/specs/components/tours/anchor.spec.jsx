import TourAnchor from '../../../src/components/tours/anchor';

import TourContext from '../../../src/models/tour/context';

describe('Tour Region', () => {
    it('checks in with tour context when mounting/unmounting', async () => {
        const context = new TourContext();
        const wrapper = mount(
            <TourAnchor id='teacher-calendar-event' tourContext={context}>
                <span>Hello</span>
            </TourAnchor>
        );
        expect(await axe(wrapper.html())).toHaveNoViolations();
        expect(context.anchors.size).toBe(1);
        wrapper.unmount();
        expect(context.anchors.size).toBe(0);
    });
});
