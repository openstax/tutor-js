import { React, PropTypes, action, observer, styled } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { GradingTemplate } from '../../models/grading/templates';

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


export default class DeleteModal extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
  };

  render () {
    const { template, onDelete, onCancel } = this.props;

    return (
      <Modal
        show={true}
        onHide={onCancel}
        backdrop="static"
      >
        <StyledHeader closeButton>
          Delete tempate?
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
  }
}
