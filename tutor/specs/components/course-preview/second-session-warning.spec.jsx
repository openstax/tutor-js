import { Wrapper, SnapShot } from '../helpers/component-testing';
import SecondSessionWarning from '../../../src/components/course-preview/second-session-warning';
import CoursePreviewUX from '../../../src/models/course/preview-ux';
import EnzymeContext from '../helpers/enzyme-context';
import { extend } from 'lodash';

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
    expect(warning.find('Body').render().text()).toContain('No problem');
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(ux.dismissNag).toHaveBeenCalled();
  });

  it('navigates on add', () => {
    const context =  EnzymeContext.build();
    const warning = shallow(<SecondSessionWarning ux={ux} />, context);
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(context.context.router.transitionTo).to.have.been.calledWith('/dashboard');
  });

});
