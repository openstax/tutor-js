import React from 'react';
import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import SmartOverflow from 'components/smart-overflow';

class TestChildComponent extends React.Component {
  render() { return (
    <span>
      i am a test
    </span>
  ); }
}

describe('SmartOverflow Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      className: 'testing',
      children: <TestChildComponent />,
    }
  );

  it('renders with className', () =>
    Testing.renderComponent( SmartOverflow, { props } ).then(function({ dom }) {
      expect(dom.classList.contains('testing')).to.be.true;
      return expect(dom.classList.contains('openstax-smart-overflow')).to.be.true;
    })
  );

  return it('renders child components', () =>
    Testing.renderComponent( SmartOverflow, { props } ).then(({ dom }) => expect(dom.textContent).equal('i am a test'))
  );
});
