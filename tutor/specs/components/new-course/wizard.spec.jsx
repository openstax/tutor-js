import { React, SnapShot } from '../helpers/component-testing';
import Router from '../../../src/helpers/router';
import BuilderUX from '../../../src/models/course/builder-ux';
import Wizard from '../../../src/components/new-course/wizard';

jest.mock('../../../src/helpers/router');

describe('Creating a course', function() {
  let ux;
  let props;
  beforeEach(() => {
    Router.currentParams.mockReturnValue({});
    ux = new BuilderUX();
    props = { isLoading: false };
  });

  it('displays as loading and then sets stage when done', function() {
    const wrapper = shallow(<Wizard isLoading={true} />);
    expect(wrapper).toHaveRendered('OXFancyLoader[isLoading=true]');
  });

  it('advances and can go back', function() {
    const wrapper = mount(<Wizard {...props} />);
    expect(wrapper).toHaveRendered('SelectType');
    expect(wrapper.instance().ux.currentStageIndex).toEqual(0);
    wrapper.find('[data-brand="tutor"]').simulate('click');
    wrapper.find('.btn.next').simulate('click');
    expect(wrapper.instance().ux.currentStageIndex).toEqual(1);
    expect(wrapper).toHaveRendered('SelectCourse');
    wrapper.find('.btn.back').simulate('click');
    expect(wrapper.instance().ux.currentStageIndex).toEqual(0);
    expect(wrapper).toHaveRendered('SelectType');
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<Wizard {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
