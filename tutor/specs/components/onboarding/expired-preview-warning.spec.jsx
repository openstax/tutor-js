import { Wrapper, SnapShot } from '../helpers/component-testing';
import ExpiredPreviewWarning from '../../../src/components/onboarding/expired-preview-warning';
import CoursePreviewUX from '../../../src/models/course/onboarding/preview';
import EnzymeContext from '../helpers/enzyme-context';

describe('Expired Preview Warning', () => {

  let ux;
  beforeEach(() => {
    ux = new CoursePreviewUX({});
    ux.dismissNag = jest.fn();
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={ExpiredPreviewWarning} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

  it('dislays got it and dismisses on continue', () => {
    const warning = shallow(<ExpiredPreviewWarning ux={ux} />);
    warning.find('Button[bsStyle="default"]').simulate('click');
    expect(warning.find('Body').render().text()).toContain('ready to create a real course');
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(ux.dismissNag).toHaveBeenCalled();
  });

  it('navigates on add', () => {
    const context =  EnzymeContext.build();
    const warning = shallow(<ExpiredPreviewWarning ux={ux} />, context);
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(context.context.router.transitionTo).to.have.been.calledWith('/dashboard');
  });

});
