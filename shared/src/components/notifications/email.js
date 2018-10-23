import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import BS from 'react-bootstrap';
import classnames from 'classnames';
import _ from 'underscore';

import URLs from '../../model/urls';
import Notifications from '../../model/notifications';

class EmailNotification extends React.Component {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,

    notice: PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    return this.props.notice.off('change', this.onChange);
  }

  onChange = () => {
    return this.forceUpdate();
  };

  onPinCheck = () => {
    return this.props.notice.sendVerification( ReactDOM.findDOMNode(this.refs.verifyInput).value, this.onSuccess);
  };

  onSuccess = () => {
    // wait a bit so the "Success" message is seen, then hide
    return _.delay(this.props.onDismiss, 1500);
  };

  onVerify = () => {
    return this.props.notice.sendConfirmation();
  };

  onVerifyKey = (ev) => {
    if (ev.key === 'Enter') {
      return this.onPinCheck();
    }
  };

  // If used elsewhere, the on/off dance needs to be extracted to a component
  UNSAFE_componentWillMount() {
    return this.props.notice.on('change', this.onChange);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.notice && (nextProps.notice !== this.props.notice)) {
      this.props.notice.off('change', this.onChange);
      return nextProps.notice.on('change', this.onChange);
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

  renderPin = () => {
    _.defer(() => (this.refs.verifyInput != null ? this.refs.verifyInput.focus() : undefined));
    return (
      <span className="body verify">
        <i className="icon fa fa-envelope-o" />
        <span className="message">
          {'\
    Check your email inbox. Enter the 6-digit verification code:\
    '}
        </span>
        <input
          autoFocus={true}
          ref="verifyInput"
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
        <i className="fa fa-spin fa-2x fa-spinner" />
      </span>
    );
  };

  renderStart = () => {
    return (
      <span className="body">
        <i className="icon fa fa-envelope-o" />
        {'\
    Verifying your email address allows you to recover your password if you ever forget it.\
    '}
        <a className="action" onClick={this.onVerify}>
          Verify now
        </a>
      </span>
    );
  };

  renderSuccess = () => {
    return (
      <span className="body">
        <i className="icon fa fa-envelope-o" />
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
          <i className="icon fa fa-exclamation-circle" />
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
        {error}
        {body}
        <a className="dismiss" onClick={this.props.onDismiss}>
          <i className="icon fa fa-close" />
        </a>
      </div>
    );
  }
}


export default EmailNotification;
