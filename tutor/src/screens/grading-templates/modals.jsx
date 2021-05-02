import { React, PropTypes, styled } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { GradingTemplate } from '../../models';

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


const DeleteModal = ({ onDelete, onCancel, template }) => {
    return (
        <Modal
            show={true}
            onHide={onCancel}
            backdrop="static"
        >
            <StyledHeader closeButton>
                Delete template?
            </StyledHeader>
            <StyledBody>
                Are you sure you want to permanently
                delete <strong>{template.name}</strong> template?
                You can't undo this action.
                <ControlsWrapper>
                    <Controls>
                        <Button className="delete" variant="default" size="lg" onClick={() => onDelete(template)}>
                            Delete
                        </Button>
                        <Button className="cancel" variant="primary" size="lg" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Controls>
                </ControlsWrapper>
            </StyledBody>
        </Modal>
    );
};
DeleteModal.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


const NoEditModal = ({ onOk, template }) => {
    return (
        <Modal
            show={true}
            onHide={onOk}
            backdrop="static"
        >
            <StyledHeader className="warning" closeButton>
                Template cannot be edited
            </StyledHeader>
            <StyledBody>
                {template.name} template cannot be edited since
                it is currently in use by assignments
                <ControlsWrapper>
                    <Controls>
                        <Button variant="default" size="lg" onClick={onOk}>
                            Okay
                        </Button>
                    </Controls>
                </ControlsWrapper>
            </StyledBody>
        </Modal>
    );
};
NoEditModal.propTypes = {
    onOk: PropTypes.func.isRequired,
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


export { DeleteModal, NoEditModal };
