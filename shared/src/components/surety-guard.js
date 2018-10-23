import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import BS from 'react-bootstrap';
import defer from 'lodash/defer';

class SuretyGuard extends React.Component {
  static defaultProps = {
    title:             'Are you sure?',
    placement:         'top',
    okButtonLabel:     'OK',
    cancelButtonLabel: 'Cancel',
  };

  static propTypes = {
    onConfirm:  PropTypes.func.isRequired,

    message:    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,

    placement:  PropTypes.string,
    okButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    onlyPromptIf: PropTypes.func,
  };

  onCancel = () => {
    this.refs.overlay.hide();
    return ReactDOM.findDOMNode(this.refs.overlay).focus();
  };

  onConfirm = (ev) => {
    this.refs.overlay.hide();
    return this.props.onConfirm(ev);
  };

  maybeShow = (ev) => {
    ev.preventDefault();
    if (this.props.onlyPromptIf && !this.props.onlyPromptIf()) {
      defer(() => this.refs.overlay.hide());
      return this.onConfirm(ev);
    } else {
      return defer(() => ReactDOM.findDOMNode(this.refs.popoverButton).focus());
    }
  };

  renderPopover = () => {
    return (
      <BS.Popover
        id="confirmation-alert"
        className="openstax-surety-guard"
        title={this.props.title}>
        <span className="message">
          {this.props.message}
        </span>
        <div className="controls">
          <BS.Button ref="popoverButton" onClick={this.onCancel}>
            {this.props.cancelButtonLabel}
          </BS.Button>
          <BS.Button onClick={this.onConfirm} bsStyle="primary">
            {this.props.okButtonLabel}
          </BS.Button>
        </div>
      </BS.Popover>
    );
  };

  render() {
    return (
      <BS.OverlayTrigger
        ref="overlay"
        trigger="click"
        onClick={this.maybeShow}
        placement={this.props.placement}
        rootClose={true}
        overlay={this.renderPopover()}>
        {this.props.children}
      </BS.OverlayTrigger>
    );
  }
}


export default SuretyGuard;
