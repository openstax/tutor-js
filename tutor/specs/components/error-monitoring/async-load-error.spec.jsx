import AsyncLoadErrors from '../../../src/components/error-monitoring/async-load-error';
import { SnapShot } from '../helpers/component-testing';
import { isReloaded, reloadOnce, forceReload } from '../../../src/helpers/reload';
jest.mock('../../../src/helpers/reload');

describe('AsyncLoadErrors Component', function() {
  let props;
  beforeEach(() => {
    props = { error: new Error('SOMETHING FAILED!') };
  });

  it('does not render if page isnt reloaded', () => {
    const err = mount(<AsyncLoadErrors {...props} />);
    expect(reloadOnce).toHaveBeenCalled();
    expect(err.html()).toBeNull();
  });

  it('renders and matches snapshot if page is reloaded', () => {
    isReloaded.mockImplementation(() => true);
    const err = mount(<AsyncLoadErrors {...props} />);
    expect(err.html()).not.toBeNull();
    expect(SnapShot.create(<AsyncLoadErrors {...props} />)).toMatchSnapshot();
  });

  it('forces a reload when clicked', () => {
    isReloaded.mockImplementation(() => true);
    const err = mount(<AsyncLoadErrors {...props} />);
    err.find('Button').simulate('click');
    expect(forceReload).toHaveBeenCalled();
  });

});
