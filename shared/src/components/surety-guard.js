import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { defer } from 'lodash';

class SuretyGuard extends React.Component {
  static defaultProps = {
    title:             'Are you sure?',
    placement:         'top',
    okButtonLabel:     'OK',
    cancelButtonLabel: 'Cancel',
  };

  static propTypes = {
    onConfirm:  PropTypes.func.isRequired,
    title: PropTypes.string,
    message:    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    placement:         PropTypes.string,
    children:          PropTypes.node,
    okButtonLabel:     PropTypes.string,
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
      <Popover
        id="confirmation-alert"
        className="openstax-surety-guard"
        title={this.props.title}>
        <span className="message">
          {this.props.message}
        </span>
        <div className="controls">
          <Button ref="popoverButton" onClick={this.onCancel}>
            {this.props.cancelButtonLabel}
          </Button>
          <Button onClick={this.onConfirm} variant="primary">
            {this.props.okButtonLabel}
          </Button>
        </div>
      </Popover>
    );
  };

  render() {
    return (
      <OverlayTrigger
        ref="overlay"
        trigger="click"
        onClick={this.maybeShow}
        placement={this.props.placement}
        rootClose={true}
        overlay={this.renderPopover()}>
        {this.props.children}
      </OverlayTrigger>
    );
  }
}


export default SuretyGuard;
