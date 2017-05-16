import {React, SnapShot, Wrapper} from '../helpers/component-testing';
import PendingVerification from '../../../src/components/my-courses/pending-verification';

describe('My Courses Pending Verification Component', function() {

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(<PendingVerification />).toJSON()).toMatchSnapshot();
  });

});
