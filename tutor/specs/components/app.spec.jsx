import { Wrapper, SnapShot } from './helpers/component-testing';

import App from '../../src/components/app';
import User from '../../src/models/user';
jest.mock('../../src/models/user', () => ({
  recordSessionStart: jest.fn(),
  verifiedRoleForCourse() {
    return 'teacher';
  },
  isConfirmedFaculty: true,
}));

jest.mock('../../src/models/chat');

describe('main Tutor App', () => {

  let props;

  beforeEach(() => {
    props = {
      location: { pathname: '/' },
    };
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={App} {...props} />).toJSON()
    ).toMatchSnapshot();
  });


  it('records user session', () => {
    shallow(<App {...props} />);
    expect(User.recordSessionStart).toHaveBeenCalled();
  });
});
