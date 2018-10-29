import { React, SnapShot } from '../../helpers';
import { observable as mockObservable } from 'mobx';
import Factory from '../../factories';
import Router from '../../../src/helpers/router';
import BuilderUX from '../../../src/screens/new-course/ux';
import Wizard from '../../../src/screens/new-course/wizard';
import Offerings from '../../../src/models/course/offerings';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));
jest.mock('../../../src/models/course/offerings', () => {
  const mockOffering = {
    id: 1, title: 'Test Offering',
    validTerms: [{
      term: 'spring',
      year: 2018,
    }],
  };

  return mockObservable({
    get: jest.fn(() => mockOffering),
    fetch: jest.fn(function(){
      return Promise.resolve();
    }),
    api: { isPending: true },
    available: {
      array: [ mockOffering ],
    },
  });
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
    Offerings.api.isPending = false;
    expect(wrapper).toHaveRendered('OXFancyLoader[isLoading=false]');
  });

  it('advances and can go back', async function() {
    const wrapper = mount(<Wizard {...props} />);

    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper.instance().ux.currentStageIndex).toEqual(0);
    Offerings.api.isPending = false;

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
