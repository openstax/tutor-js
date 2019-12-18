import React from 'react';
import SmartOverflow from '../../src/components/smart-overflow';

const TestChildComponent = () => (
  <span>
    i am a test
  </span>
);

describe('SmartOverflow Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      className: 'testing',
      children: <TestChildComponent />,
    }
  );

  it('renders with className', () => {
    expect.snapshot(<SmartOverflow {...props} />).toMatchSnapshot();
  });
});
