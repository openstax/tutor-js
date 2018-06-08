import { React, SnapShot } from '../helpers/component-testing';
import SelectDates from '../../../src/components/new-course/select-dates';
import BuilderUX from '../../../src/models/course/builder-ux';
import Offerings from '../../../src/models/course/offerings';

import OFFERINGS from '../../../api/offerings';
jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));

const OFFERING_ID = '1';

describe('CreateCourse: Selecting course dates', function() {

  let ux;
  beforeEach(() => {
    ux = new BuilderUX();
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
