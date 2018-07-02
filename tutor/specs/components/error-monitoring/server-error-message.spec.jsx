import { React } from '../helpers/component-testing';

import ErrorMessage from '../../../src/components/error-monitoring/server-error-message';


describe('Error monitoring: server-error message', function() {
  let props = {};
  beforeEach(() =>
    props = {
      status: 404,
      statusMessage: 'Not Found',
      config: {
        method: 'none',
        url: 'non-url',
        data: 'code: Red',
      },
    }
  );

  return it('renders for errors with status 500', function() {
    props.status = 500;
    const wrapper = shallow(<ErrorMessage {...props} />);
    expect(wrapper.text()).to.include('500');
    return undefined;
  });
});
