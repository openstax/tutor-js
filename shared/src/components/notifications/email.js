import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';
import classnames from 'classnames';
import { delay, defer } from 'lodash';
import URLs from '../../model/urls';
import Notifications from '../../model/notifications';

class EmailNotification extends React.Component {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,

    notice: PropTypes.shape({
      is_verified: PropTypes.bool,
      requestInProgress: PropTypes.bool,
      verifyInProgress: PropTypes.bool,
      verificationFailed: PropTypes.bool,
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      error: PropTypes.string,
      acknowledged: PropTypes.bool,
      on: PropTypes.func.isRequired,
      off: PropTypes.func.isRequired,
      sendConfirmation: PropTypes.func.isRequired,
      sendVerification: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    return this.props.notice.off('change', this.onChange);
  }

  onChange = () => {
    return this.forceUpdate();
  };

  onPinCheck = () => {
    return this.props.notice.sendVerification(
      this.pinInput.value, this.onSuccess,
    );
  };

  onSuccess = () => {
    // wait a bit so the "Success" message is seen, then hide
    return delay(this.props.onDismiss, 1500);
  };

  onVerify = () => {
    return this.props.notice.sendConfirmation();
  };

  onVerifyKey = (ev) => {
    if (ev.key === 'Enter') {
      this.onPinCheck();
    }
  };

  // If used elsewhere, the on/off dance needs to be extracted to a component
  UNSAFE_componentWillMount() {
    return this.props.notice.on('change', this.onChange);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.notice && (nextProps.notice !== this.props.notice)) {
      this.props.notice.off('change', this.onChange);
      nextProps.notice.on('change', this.onChange);
    }
  }

  acknowledge = () => {
    Notifications.acknowledge(this.props.notice);
    return undefined;
  }; // silence React warning about return value

  renderFailure = () => {
    return (
      <span className="body">
        <a href={URLs.get('accounts_profile')} className="action" target="_blank">
          {'\
    Visit Profile \x3E\x3E\
           '}
        </a>
      </span>
    );
  };

  setInputRef = (pinInput) => {
    this.pinInput = pinInput;
  }

  renderPin = () => {
    defer(() => (this.pinInput != null ? this.pinInput.focus() : undefined));
    return (
      <span className="body verify">
        <Icon type="envelope" />
        <span className="message">
          {'\
    Check your email inbox. Enter the 6-digit verification code:\
           '}
        </span>
        <input
          autoFocus={true}
          ref={this.setInputRef}
          onKeyPress={this.onVerifyKey}
          type="text" />
        <a className="pin-check action" onClick={this.onPinCheck}>
          Go
        </a>
      </span>
    );
  };

  renderSpinner = () => {
    return (
      <span className="body">
        <span className="message">
          {'\
    Requesting...\
           '}
        </span>
        <Icon type="spinner" spin />
      </span>
    );
  };

  renderStart = () => {
    return (
      <span className="body">
        <Icon type="envelope" />
        <span className="desktop-text">
          Verifying your email address allows you to recover your password if you ever forget it.
        </span>
        <span className="mobile-text">Verify your email</span>
        <a className="action" onClick={this.onVerify}>
          Verify now
        </a>
      </span>
    );
  };

  renderSuccess = () => {
    return (
      <span className="body">
        <Icon type="envelope" />
        <span className="message">
          Verification was successful!
        </span>
      </span>
    );
  };

  render() {

    let error;
    const body = this.props.notice.is_verified ?
      this.renderSuccess()
      : this.props.notice.requestInProgress ?
        this.renderSpinner()
        : this.props.notice.verifyInProgress ?
          this.props.notice.verificationFailed ?
            this.renderFailure()
            :
            this.renderPin()
          :
          this.renderStart();

    if (this.props.notice.error) {
      error =
        <span className="error">
          <Icon type="exclamation-circle" />
          <span className="body">
            {this.props.notice.error}
          </span>
        </span>;
    }

    const classNames = classnames('notification', 'email',
      { 'with-error': this.props.notice.error, acknowledged: this.props.notice.acknowledged }
    );
    return (
      <div className={classNames}>
        <div className="content">
          {error}
          {body}
        </div>
        <a className="dismiss" onClick={this.props.onDismiss}>
          <Icon type="close" />
        </a>
      </div>
    );
  }
}


export default EmailNotification;
