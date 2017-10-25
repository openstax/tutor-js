import { Wrapper, SnapShot } from './helpers/component-testing';
import EnzymeContext from './helpers/enzyme-context';
import App from '../../src/components/app';
import User from '../../src/models/user';
jest.mock('../../src/models/user', () => ({
  recordSessionStart: jest.fn(),
  logEvent: jest.fn(),
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

  it('renders even if course that doesn\'t exist', () => {
    const pathname = '/course/123';
    props.location.pathname = pathname;
    const app = mount(<App {...props} />, EnzymeContext.build({ pathname }));
    expect(app).toHaveRendered('WarningModal');
    expect(app.find('WarningModal').props().title).toContain('can’t access this cours');
    app.unmount();
  });

});
