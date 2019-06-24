import { React, PropTypes, observer, observable, action } from '../../../helpers/react';
import { AsyncButton } from 'shared';
import { Icon } from 'shared';
import TourAnchor from '../../../components/tours/anchor';
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
    ux: PropTypes.object.isRequired,
    //     onClick:     PropTypes.func.isRequired,
    //     isWaiting:   PropTypes.bool.isRequired,
    //     plan: PropTypes.object.isRequired,
  }

  @observable showModal = false;

  @action.bound close() {
    this.showModal = false;
  }

  @action.bound open() {
    this.showModal = true;
  }

  render() {
    const { ux: { plan, onDelete, isWaiting } } = this.props;

    if (plan.isNew && !isWaiting) { return null; }

    let message = 'Are you sure you want to delete this assignment?';

    if (plan.isVisibleToStudents) {
      message = `Some students may have started work on this assignment. ${message}`;
    }

    return (
      <TourAnchor id="builder-delete-button">
        <Button
          onClick={this.open}
          variant="default"
          className="control delete-assignment"
        >
          <DeleteModal
            message={message}
            show={this.showModal}
            onClose={this.close}
            isBusy={isWaiting}
            onDelete={onDelete}
          />
          <Icon type="trash" />Delete
        </Button>
      </TourAnchor>
    );
  }

}
