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

const ConfirmTemplateModal = observer(({ onConfirm, onCancel }) => {
    return (
        <Modal
            show={true}
            onHide={onCancel}
            backdrop="static"
            backdropClassName="stacked-modal-backdrop"
        >
            <StyledHeader closeButton>
        Change grading template?
            </StyledHeader>
            <StyledBody>
                <p>Changing the grading template applied to an assignment may
        affect the existing grades and assignment dates for the class.</p>
                <p>Do you still wish to continue?</p>
                <ControlsWrapper>
                    <Controls>
                        <Button
                            data-test-id="cancel-confirm-change-template"
                            variant="default"
                            className="btn-standard btn-inline"
                            onClick={onCancel}
                        >
              No
                        </Button>
                        <Button
                            data-test-id="confirm-change-template"
                            className="btn-standard btn-inline"
                            onClick={onConfirm}
                        >
              Continue
                        </Button>
                    </Controls>
                </ControlsWrapper>
            </StyledBody>
        </Modal>
    );
});

ConfirmTemplateModal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ConfirmTemplateModal;
