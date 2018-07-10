import { React, observer, observable, action } from '../../../helpers/react';
import { AsyncButton } from 'shared';
import Icon from '../../icon';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ message, show, onClose, isBusy, onDelete }) => (
  <Modal
    show={show}
    onHide={onClose}
    className="settings-delete-assessment-modal">
    <Modal.Header closeButton={true}>
      <Modal.Title>
        Delete
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <AsyncButton
        className="delete"
        bsStyle="danger"
        onClick={onDelete}
        waitingText="Deleting…"
        isWaiting={isBusy}>
        Delete
      </AsyncButton>
      <Button disabled={isBusy} onClick={onClose}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
);

@observer
export default class DeleteLink extends React.PureComponent {

  static propTypes = {
    onClick:     React.PropTypes.func.isRequired,
    isWaiting:   React.PropTypes.bool.isRequired,
    isFailed:    React.PropTypes.bool.isRequired,
    isNew:       React.PropTypes.bool.isRequired,
    isVisibleToStudents: React.PropTypes.bool.isRequired,
  }

  @observable showModal = false;

  @action.bound close() {
    this.showModal = false;
  }

  @action.bound open() {
    this.showModal = true;
  }

  render() {
    if (this.props.isNew && !this.props.isWaiting) { return null; }

    let message = 'Are you sure you want to delete this assignment?';

    if (this.props.isVisibleToStudents) {
      message = `Some students may have started work on this assignment. ${message}`;
    }

    return (
      <Button
        onClick={this.open}
        bsStyle="default"
        className="control delete-assignment">
        <DeleteModal
          message={message}
          show={this.showModal}
          onClose={this.close}
          isBusy={this.props.isWaiting}
          onDelete={this.props.onClick}
        />
        <Icon type="trash" />Delete
      </Button>
    );
  }

}
