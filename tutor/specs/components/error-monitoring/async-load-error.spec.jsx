import AsyncLoadErrors from '../../../src/components/error-monitoring/async-load-error';
import { isReloaded, reloadOnce, forceReload } from '../../../src/helpers/reload';
jest.mock('../../../src/helpers/reload');

describe('AsyncLoadErrors Component', function() {
  let props;
  let consoleMock;

  beforeEach(() => {
    consoleMock = jest.spyOn(console, 'warn');
    consoleMock.mockImplementation(() => {})
    props = { error: new Error('SOMETHING FAILED!') };
  });

  afterEach(() => {
    consoleMock.mockRestore();
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
    expect.snapshot(<AsyncLoadErrors {...props} />).toMatchSnapshot();
  });

  it('forces a reload when clicked', () => {
    isReloaded.mockImplementation(() => true);
    const err = mount(<AsyncLoadErrors {...props} />);
    err.find('Button').simulate('click');
    expect(forceReload).toHaveBeenCalled();
  });

});
