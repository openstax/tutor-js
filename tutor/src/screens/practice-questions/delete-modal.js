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

const DeleteQuestionModal = observer(({ onDelete, onCancel }) => {
    return (
        <Modal
            show={true}
            onHide={onCancel}
            backdrop="static"
        >
            <StyledHeader closeButton>
        Delete question?
            </StyledHeader>
            <StyledBody>
                <p>Are you sure you want to permanently delete this question from practice?</p>
                <p>You can't undo this action.</p>
                <ControlsWrapper>
                    <Controls>
                        <Button
                            data-test-id="confirm-delete-practice-question"
                            variant="default"
                            className="btn-standard btn-inline"
                            onClick={onDelete}
                        >
              Delete
                        </Button>
                        <Button
                            data-test-id="cancel-delete-practice-question"
                            className="btn-standard btn-inline"
                            onClick={onCancel}
                        >
              Cancel
                        </Button>
                    </Controls>
                </ControlsWrapper>
            </StyledBody>
        </Modal>
    );
});

DeleteQuestionModal.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DeleteQuestionModal;
