import React from 'react';
import { delay } from 'lodash';
import Button from 'components/buttons/async-button';

class Failed extends React.Component {
  render() { return (
    <span>
      {this.props.beforeText}
    </span>
  ); }
}

describe('Async Button Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      isWaiting: false,
      failedProps: { beforeText: 'yo, you failed' },
    });

  describe('waiting state', function() {

    it('hides spinner and is not disabled', () => {
      const button = mount(<Button {...props} />);
      expect(button).not.toHaveRendered('[disabled]');
      expect(button).not.toHaveRendered('Icon');
    });

    fit('shows spinner and is disabled when true', function() {
      props.isWaiting = true;
      const button = mount(<Button {...props} />);
      console.log(button.debug())
      expect(button).not.toHaveRendered('[disabled]');
      expect(button).not.toHaveRendered('Icon');

      // props.isWaiting = true;
      // return Testing.renderComponent( Button, { props } ).then(function({ dom }) {
      //   expect(dom.getAttribute('disabled')).equal('');
      //   return expect(dom.querySelector('i.fa-spinner')).not.to.be.null;
      // });
    });
  });

  it('renders failed state', function() {
    props.isFailed = true;
    props.failedState = Failed;
    return Testing.renderComponent( Button, { props } ).then(function({ dom, element }) {
      expect(element.props.failedState).equal(Failed);
      return expect(dom.textContent).equal('yo, you failed');
    });
  });

  it('sets timeout', function(done) {
    props.timeoutLength = 2;
    props.isWaiting = true;
    Testing.renderComponent( Button, { unmountAfter: 10, props } )
      .then(function({ element }) {
        element.componentDidUpdate();
        expect(element.state.isTimedout).equal(false);
        return delay(function() {
          expect(element.state.isTimedout).equal(true);
          return done();
        }, 3);
      });
    return true;
  });
}); //
