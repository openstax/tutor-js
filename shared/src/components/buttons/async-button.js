import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import RefreshButton from './refresh-button';
import Icon from '../icon';

export default class AsyncButton extends React.Component {
  static defaultProps = {
      isDone: false,
      isFailed: false,
      waitingText: 'Loading…',
      failedState: RefreshButton,
      failedProps: {
          beforeText: 'There was a problem.  ',
      },

      doneText: '',
      isJob: false,
  };

  static displayName = 'AsyncButton';

  static propTypes = {
      isWaiting: PropTypes.bool.isRequired,
      isDone: PropTypes.bool,
      isFailed: PropTypes.bool,
      isDisabled: PropTypes.bool,
      active: PropTypes.bool,
      waitingText: PropTypes.node,
      failedState: PropTypes.func,
      failedProps: PropTypes.object,
      doneText: PropTypes.node,
      isJob: PropTypes.bool,
      onClick: PropTypes.func,
      variant: PropTypes.string,
      size: PropTypes.string,
      timeoutLength: PropTypes.number,
      className: PropTypes.string,
      children: PropTypes.node,
  };

  state = {
      isTimedout: false,
      delayTimeout: null,
  };

  render() {
      let spinner, stateClass, text;
      let {
      className, isDisabled, isJob, failedState, // eslint-disable-line
          isWaiting, isDone, isFailed, children, waitingText,
          failedProps, doneText, ...buttonProps
      } = this.props;

      // needs to be capitalized so JSX will transpile as a variable, not element
      const FailedState = this.props.failedState;

      const buttonTypeClass = 'async-button';

      if (isFailed) {
          stateClass = 'is-failed';
          return <FailedState {...failedProps} />;
      } else if (isWaiting) {
          stateClass = 'is-waiting';
          text = waitingText;
          isDisabled = true;
          spinner = <Icon type='spinner' spin />;
      } else if (isDone) {
          stateClass = 'is-done';
          text = doneText;
      } else {
          stateClass = null;
          text = children;
      }

      return (
          <Button
              size={this.props.size}
              variant={this.props.variant}
              onClick={this.props.onClick}
              className={[buttonTypeClass, stateClass, className]}
              active={this.props.active}
              disabled={isDisabled}
              {...buttonProps}
          >
              {spinner}
              {text}
          </Button>
      );
  }
}
