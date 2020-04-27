import { C } from '../helpers';
import App from '../../src/components/app';
import User from '../../src/models/user';
jest.mock('../../src/models/user', () => ({
  recordSessionStart: jest.fn(),
  logEvent: jest.fn(),
  verifiedRoleForCourse() {
    return 'teacher';
  },
  isAllowedSchoolType: true,
  isConfirmedFaculty: true,
  terms: {
    api: {
      isPending: false,
    },
  },
}));

jest.mock('../../src/models/chat');

describe('main Tutor App', () => {

  let props;

  beforeEach(() => {
    props = {
      app: {},
      location: { pathname: '/' },
    };
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(<C><App {...props} /></C>).toMatchSnapshot();
  });


  it('records user session', () => {
    mount(<C><App {...props} /></C>);
    expect(User.recordSessionStart).toHaveBeenCalled();
  });

});
