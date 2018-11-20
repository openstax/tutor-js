import { EnzymeContext, C } from '../../helpers';
import PreviewOnlyWarning from '../../../src/components/onboarding/preview-only-warning';
import CoursePreviewUX from '../../../src/models/course/onboarding/preview';

describe('Preview Only Warning', () => {

  let ux;

  beforeEach(() => {
    ux = new CoursePreviewUX({});
    Object.assign(ux, {
      hasViewedPublishWarning: jest.fn(),
    });
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(
      <C><PreviewOnlyWarning ux={ux} /></C>
    ).toMatchSnapshot();
  });

  it('dismisses on continue', async () => {
    const wrapper = mount(<PreviewOnlyWarning ux={ux} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('button.continue').simulate('click');
    expect(ux.hasViewedPublishWarning).toHaveBeenCalled();
  });

  it('navigates on add', async () => {
    const context =  EnzymeContext.build();
    const wrapper = mount(<PreviewOnlyWarning ux={ux} />, context);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('button.create').simulate('click');
    expect(context.context.router.history.push).toHaveBeenCalledWith('/dashboard');
  });

});
