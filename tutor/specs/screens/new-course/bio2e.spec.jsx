import { React, SnapShot, Wrapper } from '../../components/helpers/component-testing';
import Bio2eUnavail from '../../../src/screens/new-course/bio2e-unavailable';

describe('Bio2e unavailable', () => {

  let props;
  beforeEach(() => {
    props = { };
  });

  it('matches snapshot', function() {
    const title = SnapShot.create(<Wrapper _wrapped_component={Bio2eUnavail.title} {...props} />);
    expect(title.toJSON()).toMatchSnapshot();

    const component = SnapShot.create(<Wrapper _wrapped_component={Bio2eUnavail} {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
