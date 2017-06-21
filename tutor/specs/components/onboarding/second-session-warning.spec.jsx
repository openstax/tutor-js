import { Wrapper, SnapShot } from '../helpers/component-testing';
import SecondSessionWarning from '../../../src/components/onboarding/second-session-warning';
import CoursePreviewUX from '../../../src/models/course/onboarding/preview';
import EnzymeContext from '../helpers/enzyme-context';
import { extend } from 'lodash';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user', () => ({
  logEvent: jest.fn(),
}));

describe('Second Session Warning', () => {

  let ux;
  beforeEach(() => {
    ux = new CoursePreviewUX({});
    ux.dismissNag = jest.fn();
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={SecondSessionWarning} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

  it('dislays got it and dismisses on continue', () => {
    const warning = shallow(<SecondSessionWarning ux={ux} />);
    warning.find('Button[bsStyle="default"]').simulate('click');
    expect(User.logEvent).toHaveBeenCalledWith({ category: 'onboarding', code: 'like_preview_ask_later' });
    expect(warning.find('Body').render().text()).toContain('ready to create a real course');
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(ux.dismissNag).toHaveBeenCalled();
  });

  it('navigates and logs on add', () => {
    const context =  EnzymeContext.build();
    const warning = shallow(<SecondSessionWarning ux={ux} />, context);
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(User.logEvent).toHaveBeenCalledWith({ category: 'onboarding', code: 'like_preview_yes' });
    expect(context.context.router.transitionTo).to.have.been.calledWith('/dashboard');
  });

});
