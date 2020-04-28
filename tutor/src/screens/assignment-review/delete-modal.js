import { React, PropTypes, styled, observer } from 'vendor';
import { Button, Modal } from 'react-bootstrap';

const StyledHeader = styled(Modal.Header)`
  font-weight: bold;

  .close {
    font-size: 3rem;
  }
`;

const StyledBody = styled(Modal.Body)`
  font-size: 1.6rem;
  line-height: 2.5rem;
`;

const ControlsWrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Controls = styled.div`
  .btn + .btn {
    margin-left: 1.5rem;
  }
`;

const DeleteModal = observer(({ ux: { onConfirmDelete, onCancelDelete } }) => {
  return (
    <Modal
      show={true}
      onHide={onCancelDelete}
      backdrop="static"
    >
      <StyledHeader closeButton>
        Delete assignment?
      </StyledHeader>
      <StyledBody>
        <p>Some students may have started work on this assignment. Are you sure you want to permanently
        delete this assignment?</p>
        <p>You can't undo this action.</p>
        <ControlsWrapper>
          <Controls>
            <Button
              data-test-id="confirm-delete-assignment"
              variant="default"
              className="btn-standard btn-inline"
              onClick={onConfirmDelete}
            >
              Delete
            </Button>
            <Button
              data-test-id="cancel-delete-assignment"
              className="btn-standard btn-inline"
              onClick={onCancelDelete}
            >
              Cancel
            </Button>
          </Controls>
        </ControlsWrapper>
      </StyledBody>
    </Modal>
  );
});

DeleteModal.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default DeleteModal;
