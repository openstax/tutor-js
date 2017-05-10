import { Wrapper, SnapShot } from '../helpers/component-testing';
import SecondSessionWarning from '../../../src/components/course-preview/second-session-warning';
import CoursePreviewUX from '../../../src/models/course/preview-ux';
import EnzymeContext from '../helpers/enzyme-context';

describe('Second Session Warning', () => {

  let ux;
  beforeEach(() => {
    ux = new CoursePreviewUX({});
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={SecondSessionWarning} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

  it('dislays got it and dismisses on continue', () => {
    const warning = shallow(<SecondSessionWarning ux={ux} />);
    expect(ux.isDismissed).toBe(false);
    warning.find('Button[bsStyle="default"]').simulate('click');
    expect(ux.isDismissed).toBe(false);
    expect(warning.find('Body').render().text()).toContain('No problem');
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(ux.isDismissed).toBe(true);
  });

  it('navigates on add', () => {
    const context =  EnzymeContext.build();
    const warning = shallow(<SecondSessionWarning ux={ux} />, context);
    warning.find('Button[bsStyle="primary"]').simulate('click');
    expect(context.context.router.transitionTo).to.have.been.calledWith('/new-course');
  });

});
