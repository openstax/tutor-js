import { React, PropTypes, styled, observer, observable, action, modelize } from 'vendor';
import { Icon } from 'shared';
import TourAnchor from '../../components/tours/anchor';
import { Modal, Button } from 'react-bootstrap';

const DeleteWrapper = styled(TourAnchor)`
  margin-left: 1rem;
`;

// eslint-disable-next-line
const DeleteModal = observer(({ isVisible, show, onClose, isBusy, onDelete }) => {

    return (
        <Modal
            show={show}
            onHide={onClose}
            className="settings-delete-assessment-modal">
            <Modal.Header closeButton>
                <Modal.Title>
          Delete assignment?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isVisible && <p>Some students may have started work on this assignment.</p>}
                <p>
          Are you sure you want to permanently delete this assignment?
                </p>
                <p>You can’t undo this action.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="delete"
                    variant="danger"
                    onClick={onDelete}
                    data-test-id="confirm-delete-assignment"
                >
                    Delete
                </Button>
                <Button variant="default" disabled={isBusy} onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

@observer
export default class DeleteButton extends React.Component {
    static propTypes = {
        ux: PropTypes.object.isRequired,
    }

    @observable showModal = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound close() {
        this.showModal = false;
    }

    @action.bound open() {
        this.showModal = true;
    }

    @action.bound onDelete() {
        this.showModal = false;
        this.props.ux.onDelete();
    }

    render() {
        const { plan, isApiPending } = this.props.ux;
        if (plan.isNew && !isApiPending) { return null; }

        return (
            <DeleteWrapper id="builder-delete-button">
                <DeleteModal
                    isVisible={plan.isVisibleToStudents}
                    show={this.showModal}
                    onClose={this.close}
                    isBusy={isApiPending}
                    onDelete={this.onDelete}
                />
                <Button
                    onClick={this.open}
                    variant="plain"
                    className="control delete-assignment"
                    data-test-id="delete-assignment"
                >
                    <Icon type="trash" />Delete
                </Button>
            </DeleteWrapper>
        );
    }
}
