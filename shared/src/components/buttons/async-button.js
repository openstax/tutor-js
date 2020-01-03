import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { delay } from 'lodash';
import RefreshButton from './refresh-button';
import Icon from '../icon';

export default class extends React.Component {
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

  componentDidUpdate() {
    const { isWaiting, isJob } = this.props;
    let { isTimedout, delayTimeout } = this.state;

    if (!delayTimeout && isWaiting && !isTimedout) {
      const timeout = this.props.timeoutLength || (isJob ? 600000 : 30000);
      delayTimeout = delay(this.checkForTimeout, timeout);
      this.setState({ delayTimeout });
    }
  }

  componentWillUnmount() {
    return this.clearDelay();
  } // make sure any pending timeouts are removed

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isWaiting !== nextProps.isWaiting) {
      if (!nextProps.isWaiting) { this.clearDelay(); }
      this.setState({ delayTimeout: null });
    }
  }

  checkForTimeout = () => {
    const { isWaiting } = this.props;
    if (isWaiting) { this.setState({ isTimedout: true, delayTimeout: null }); }
  };

  clearDelay = () => {
    const { delayTimeout } = this.state;
    if (delayTimeout) { clearTimeout(delayTimeout); }
  };

  render() {
    let spinner, stateClass, text;
    let {
      className, isDisabled, isJob, failedState, // eslint-disable-line
      isWaiting, isDone, isFailed, children, waitingText,
      failedProps, doneText, ...buttonProps
    } = this.props;
    const { isTimedout } = this.state;
    // needs to be capitalized so JSX will transpile as a variable, not element
    const FailedState = this.props.failedState;

    const buttonTypeClass = 'async-button';

    if (isFailed || isTimedout) {
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
