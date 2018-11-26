import { React, observer, observable, action } from '../../../helpers/react';
import { AsyncButton } from 'shared';
import { Icon } from 'shared';
import PropTypes from 'prop-types';
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
        variant="danger"
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

export default
@observer
class DeleteTaskButton extends React.Component {

  static propTypes = {
    onClick:     PropTypes.func.isRequired,
    isWaiting:   PropTypes.bool.isRequired,
    isFailed:    PropTypes.bool.isRequired,
    isNew:       PropTypes.bool.isRequired,
    isVisibleToStudents: PropTypes.bool.isRequired,
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
        variant="default"
        className="control delete-assignment"
      >
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

};
