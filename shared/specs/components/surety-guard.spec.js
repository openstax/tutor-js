import { Testing, expect, sinon, _ } from 'shared/specs/helpers';
import React from 'react';

import SuretyGuard from 'components/surety-guard';

class WrappedComponent extends React.Component {
  render() {
    return (
      <SuretyGuard {...this.props}>
        <a>
          i am a test link
        </a>
      </SuretyGuard>
    );
  }
}

describe('SuretyGuard', function() {
  let props = null;

  beforeEach(() =>
    props = {
      onConfirm: sinon.spy(),
      message: 'Yo!, you sure?',
    }
  );

  it('renders children', () =>
    Testing.renderComponent( WrappedComponent, { props } ).then(({ dom }) => expect(dom.textContent).to.include('i am a test link'))
  );

  return it('displays when clicked', function(done) {
    Testing.renderComponent( WrappedComponent, { props } ).then(function({ dom, element }) {
      expect(window.document.querySelector('.openstax-surety-guard')).not.to.exist;
      Testing.actions.click(dom);
      return _.defer(function() {
        const guard = window.document.querySelector('.openstax-surety-guard');
        expect(guard).to.exist;
        expect(guard.textContent).to.include('Yo!');
        return done();
      });
    });
    return true;
  });
});
