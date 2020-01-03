/* eslint-disable no-console */
import ErrorBoundary from '../../../src/components/error-monitoring/boundary';

// eslint-disable-next-line no-undef
const BadBoi = () => popGoesTheWeasle();

describe('Error monitoring: client-side errors', () => {
  let props = {};
  beforeEach(() => {
    props = {
      app: {
        logError: jest.fn(),
      },
    };
  });

  it('renders children when alls well', function() {
    const wrapper = mount(
      <ErrorBoundary {...props}><p>hi!</p></ErrorBoundary>
    );
    expect(wrapper.text()).toContain('hi!');
  });

  it('logs error and displays message', function() {
    const { error } = console;
    console.error = jest.fn();
    const wrapper = mount(
      <ErrorBoundary {...props}><BadBoi /></ErrorBoundary>
    );
    expect(wrapper.text()).toContain('Something went wrong');
    expect(props.app.logError).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    console.error = error;
  });

});
