import CourseNag from '../../../src/components/onboarding/course-nag';
import TourContext from '../../../src/models/tour/context';

import { observable } from 'mobx';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user', () => ({
  viewed_tour_ids: { clear: jest.fn() },
}));

jest.mock('../../../src/models/tour/context', () => (
  class MockContext {
    tour: {}
  }
));

function SomethingToDo() { return <span>Hi!</span>; }

describe('Second Session Warning', () => {

  let ux, tourContext, props, spyMode;

  beforeEach(() => {
    ux = observable.object({
      nagComponent: SomethingToDo,
      course: {
        resetToursAndOnboarding: jest.fn(),
      },
    });
    spyMode = observable.object({ isEnabled: false });
    tourContext = new TourContext();
    props = {
      ux,
      spyMode,
      tourContext,
    };
  });

  it('renders and matches snapshot', () => {
    const nag = mount(<CourseNag {...props}/>);
    expect(nag).toHaveRendered('CourseNagModal');
  });

  it('replays tours when spy mode is triggered', () => {
    mount(<CourseNag {...props} />);
    spyMode.isEnabled = true;
    expect(ux.course.resetToursAndOnboarding).toHaveBeenCalled();
    expect(User.viewed_tour_ids.clear).toHaveBeenCalled();
  });

});
