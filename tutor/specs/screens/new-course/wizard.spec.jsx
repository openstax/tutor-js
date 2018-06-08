import { React, SnapShot } from '../helpers/component-testing';
import Router from '../../../src/helpers/router';
import BuilderUX from '../../../src/models/course/builder-ux';
import Wizard from '../../../src/components/new-course/wizard';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));
jest.mock('../../../src/models/course/offerings', () => {
  const mockOffering = {
    id: 1, title: 'Test Offering',
    validTerms: [ {
      term: 'spring',
      year: 2018,
    } ],
  };

  return {
    get: jest.fn(() => mockOffering),
    fetch: jest.fn(function(){
      this.api.isPending = true;
      return Promise.resolve()
    }),
    api: { isPending: false },
    tutor: {
      array: [ mockOffering ],
    },
  };
});

describe('Creating a course', function() {

  let props;
  beforeEach(() => {
    Router.currentParams.mockReturnValue({});
  });

  it('displays as loading and then sets stage when done', async function() {
    const wrapper = shallow(<Wizard />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper.instance().ux.isBusy).toBe(true);
    expect(wrapper).toHaveRendered('OXFancyLoader[isLoading=true]');
  });

  it('advances and can go back', async function() {
    const wrapper = mount(<Wizard {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();

    expect(wrapper.instance().ux.currentStageIndex).toEqual(0);
    expect(wrapper).toHaveRendered('SelectCourse');
    expect(wrapper).toHaveRendered('.btn.next[disabled=true]');
    wrapper.find('.choice').simulate('click');

    wrapper.find('.btn.next[disabled=false]').simulate('click');

    expect(wrapper.instance().ux.currentStageIndex).toEqual(1);
    expect(wrapper).toHaveRendered('SelectDates');
    wrapper.find('.btn.back').simulate('click');
    expect(wrapper.instance().ux.currentStageIndex).toEqual(0);
    expect(wrapper).toHaveRendered('SelectCourse');
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<Wizard {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
