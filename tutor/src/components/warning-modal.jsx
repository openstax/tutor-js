import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import classnames from 'classnames';
import { Icon } from 'shared';

@observer
export default
class WarningModal extends React.Component {

  static propTypes = {
      title: PropTypes.string.isRequired,
      children: PropTypes.any,
      footer: PropTypes.element,
      onDismiss: PropTypes.func,
      className: PropTypes.string,
      backdrop: PropTypes.bool,
  }

  static defaultProps = {
      backdrop: true,
  }

  @observable isShowing = true;

  @action.bound onClose() {
      if (this.onDismiss) {
          this.isShowing = false;
          this.onDismiss();
      }
  }

  renderFooter() {
      if (!this.props.footer) { return null; }
      return (
          <Modal.Footer>{this.props.footer}</Modal.Footer>
      );
  }

  render() {
      const { title, children, backdrop } = this.props;
      const className = classnames('warning', this.props.className, { backdrop });
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
              <Modal.Body>
                  {children}
              </Modal.Body>
              {this.renderFooter()}
          </Modal>
      );
  }

}
