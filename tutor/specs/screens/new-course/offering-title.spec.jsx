import { React, SnapShot } from '../helpers/component-testing';

import Offerings from '../../../src/models/course/offerings';
import OFFERINGS from '../../../api/offerings';
import OfferingTitle from '../../../src/components/new-course/offering-title';


describe('CreateCourse: choosing offering', function() {

  beforeEach(() => {
    Offerings.onLoaded({ data: OFFERINGS });
  });

  afterEach(() => Offerings.clear());

  it('doesn’t blow up when appearance code from offering is invalid', async function() {
    const offering = Offerings.get(1);
    offering.appearance_code = 'firefirefire';
    const wrapper = shallow(<OfferingTitle offering={offering} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper).toHaveRendered('[data-appearance="firefirefire"]');
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<OfferingTitle offering={Offerings.get(2)} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
