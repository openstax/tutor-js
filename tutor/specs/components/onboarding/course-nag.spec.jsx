import CourseNag from '../../../src/components/onboarding/course-nag';
import TourContext from '../../../src/models/tour/context';

import { observable } from 'mobx';

jest.mock('../../../src/models/tour/context', () => (
  class MockContext {
    tour: {}
  }
));

function SomethingToDo() { return <span>Hi!</span>; }

describe('Second Session Warning', () => {

  let ux, tourContext, props;

  beforeEach(() => {
    ux = observable.object({
      nagComponent: SomethingToDo,
    });
    tourContext = new TourContext();
    props = {
      ux,
      tourContext,
    };
  });

  it('renders and matches snapshot', () => {
    const nag = mount(<CourseNag {...props}/>);
    expect(nag).toHaveRendered('CourseNagModal');
  });

});
