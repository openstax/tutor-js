import { React, SnapShot, Wrapper } from '../helpers/component-testing';
import Bio2eUnavail from '../../../src/components/new-course/bio2e-unavailable';

describe('Bio2e unavailable', () => {

  let props;
  beforeEach(() => {
    props = { };
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<Wrapper _wrapped_component={Bio2eUnavail} {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
