import { React, SnapShot } from '../../components/helpers/component-testing';
import Offerings from '../../../src/models/course/offerings';
import SelectDates from '../../../src/screens/new-course/select-dates';
import BuilderUX from '../../../src/screens/new-course/ux';

Offerings.fetch = () => Promise.resolve();

import OFFERINGS from '../../../api/offerings';
jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));

const OFFERING_ID = '1';

describe('CreateCourse: Selecting course dates', function() {

  let ux, route;
  beforeEach(() => {
    route = { match: { params: { } } };
    ux = new BuilderUX({ route });
    Offerings.onLoaded({ data: OFFERINGS });
    ux.newCourse.offering = Offerings.get(OFFERING_ID);
  });

  it('it sets state when date row is clicked', async function() {
    const wrapper = mount(<SelectDates ux={ux} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('.list-group-item').at(0).simulate('click');
    expect(ux.newCourse.term).toEqual(
      Offerings.get(OFFERING_ID).active_term_years[0]
    );
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<SelectDates ux={ux} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
