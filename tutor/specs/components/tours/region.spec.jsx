import TourRegion from '../../../src/components/tours/region';

import TourContext from '../../../src/models/tour/context';
jest.useFakeTimers();

describe('Tour Region', () => {
  it('checks in with tour context when mounting/unmounting', () => {
    const context = new TourContext();
    const wrapper = mount(
      <TourRegion id='teacher-calendar' tourContext={context}>
        <span>Hello</span>
      </TourRegion>
    );
    jest.runAllTimers();
    expect(context.tours).toHaveLength(1);
    wrapper.unmount();
    expect(context.tours).toHaveLength(0);
  });
});
