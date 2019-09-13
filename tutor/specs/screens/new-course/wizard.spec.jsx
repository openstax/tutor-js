import { R, React } from '../../helpers';
import Router from '../../../src/helpers/router';
import BuilderUX from '../../../src/screens/new-course/ux';
import Wizard from '../../../src/screens/new-course/wizard';
import { OfferingsMap, Offering } from '../../../src/models/course/offerings';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));

describe('Creating a course', function() {

  let props;
  beforeEach(() => {
    Router.currentParams.mockReturnValue({});
    const offerings = new OfferingsMap();
    offerings.fetch = jest.fn(function() {
      this.api.requestsInProgress.set('fake','fake');
      this.set(1, new Offering({ id: 1, title: 'Test Offering' }));
      return Promise.resolve();
    });
    props = {
      ux: new BuilderUX({
        router: { route: { match: { params: {} } } },
        offerings,
      }),
    };
  });

  it('displays as loading and then sets stage when done', async function() {
    const wrapper = mount(<R><Wizard {...props} /></R>);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(props.ux.isBusy).toBe(true);
    expect(wrapper).toHaveRendered('StaxlyAnimation[isLoading=true]');
    props.ux.offerings.api.requestsInProgress.clear();
    expect(wrapper).toHaveRendered('StaxlyAnimation[isLoading=false]');
  });

  it('advances and can go back', async function() {
    const wrapper = mount(<R><Wizard {...props} /></R>);

    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(props.ux.currentStageIndex).toEqual(0);
    props.ux.offerings.api.requestsInProgress.clear();
    expect(props.ux.isBusy).toBe(false);

    expect(wrapper).toHaveRendered('SelectCourse');
    expect(wrapper).toHaveRendered('.btn.next[disabled=true]');

    wrapper.find('.choice').simulate('click');
    wrapper.find('.btn.next[disabled=false]').simulate('click');
    expect(props.ux.currentStageIndex).toEqual(1);
    expect(wrapper).toHaveRendered('SelectDates');
    wrapper.find('.btn.back').simulate('click');
    expect(props.ux.currentStageIndex).toEqual(0);
    expect(wrapper).toHaveRendered('SelectCourse');
  });

  it('matches snapshot', function() {
    props.ux.offerings.api.requestsInProgress.clear();
    expect.snapshot(<R><Wizard {...props} /></R>).toMatchSnapshot();
  });
});
