import {React, SnapShot, Wrapper} from '../helpers/component-testing';
import Dashboard from '../../../src/components/student-dashboard';

describe('Student Dashboard', () => {
  let props;
  beforeEach(() => {
    props = {
      params: {
        courseId: '999',
      },
    };
  });


  it('renders with non-a-student message', () => {
    const dash = mount(<Dashboard {...props} />);
    console.log(dash.debug());
    expect(dash).toHaveRendered('WarningModal');
  });

});
