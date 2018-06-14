import { React, SnapShot } from '../../components/helpers/component-testing';
import Bio1eUnavail from '../../../src/screens/new-course/bio1e-unavailable';
import BuilderUX from '../../../src/screens/new-course/ux';
import Offerings from '../../../src/models/course/offerings';
import Factory from '../../factories';

describe('Bio2e unavailable', () => {

  let props;
  let ux;
  let offering;

  beforeEach(() => {
    ux = new BuilderUX();
    offering = Factory.offering({ appearance_code: 'biology_2e' });
    props = { ux };
    Offerings.replace({ [`${offering.id}`]: offering });

  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<Bio1eUnavail {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('stores and advances', () => {
    const unavail = mount(<Bio1eUnavail {...props} />);
    expect(ux.alternateOffering).toBeUndefined();
    unavail.find('.list-group-item').at(0).simulate('click');
    expect(ux.alternateOffering).toBe(offering);
  });
});
