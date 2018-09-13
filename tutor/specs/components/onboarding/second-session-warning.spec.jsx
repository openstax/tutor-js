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

  it('dislays got it and dismisses on continue', async () => {
    const wrapper = shallow(<SecondSessionWarning ux={ux} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('Button[bsStyle="default"]').simulate('click');
    expect(User.logEvent).toHaveBeenCalledWith({ category: 'onboarding', code: 'like_preview_ask_later' });
    expect(wrapper.find('Body').render().text()).toContain('ready to create a real course');
    wrapper.find('Button[bsStyle="primary"]').simulate('click');
    expect(ux.dismissNag).toHaveBeenCalled();
  });

  it('navigates and logs on add', async () => {
    const context =  EnzymeContext.build();
    const wrapper = shallow(<SecondSessionWarning ux={ux} />, context);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('Button[bsStyle="primary"]').simulate('click');
    expect(User.logEvent).toHaveBeenCalledWith({ category: 'onboarding', code: 'like_preview_yes' });
    expect(context.context.router.history.push).toHaveBeenCalledWith('/dashboard');
  });

});
