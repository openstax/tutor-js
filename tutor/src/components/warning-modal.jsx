import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';

@observer
export default class WarningModal extends React.PureComponent {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    onDismiss: React.PropTypes.func,
    className: React.PropTypes.string,
  }

  @observable isShowing = true;

  @action.bound onClose() {
    this.isShowing = false;
    this.onDismiss();
  }

  render() {
    const { title, message } = this.props;

    return (
      <Modal
        className={classnames('warning', this.props.className)}
        show={this.isShowing}
        onHide={this.onClose}
      >
        <Modal.Header className="warning">{title}</Modal.Header>
        <Modal.Body>{message}</Modal.Body>
      </Modal>
    );
  }

}
