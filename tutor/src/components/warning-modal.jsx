import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';
import Icon from './icon';

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
    if (this.onDismiss) {
      this.isShowing = false;
      this.onDismiss();
    }
  }

  render() {
    const { title, message } = this.props;
    const className = classnames('warning', this.props.className);

    return (
      <Modal
        backdropClassName={className}
        className={className}
        show={this.isShowing}
        onHide={this.onClose}
        backdrop={false}
      >
        <Modal.Header className="warning">
          <Icon type="exclamation-triangle" />
          {title}
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
      </Modal>
    );
  }

}
