import React from 'react'
import styled from 'styled-components'
import { Button, Modal } from 'react-bootstrap'
import { colors } from 'theme'
import { Icon } from 'shared'

const StyledHeader = styled(Modal.Header)`
  &&& {
    font-weight: bold;
    font-size: 1.8rem;
    padding: 3rem;
    .close {
        font-size: 3rem;
    }
    &.warning {
        background-color: ${colors.trouble};
        svg[data-icon="exclamation-triangle"] {
            font-size: 1.8rem;
        }
        .close {
            color: ${colors.strong_red};
        }
    }
  }
`;

const StyledBody = styled(Modal.Body)`
  font-size: 1.6rem;
  line-height: 2.5rem;
  .note {
      font-size: 1.4rem;
      color: ${colors.neutral.thin};
  }
`;

const ControlsWrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Controls = styled.div`
  .btn.btn-default {
    background-color: white;
    color: ${colors.neutral.grayblue};
  }
  .btn + .btn {
    margin-left: 1.5rem;
  }
`

interface DeleteOfferingModalProps {
    show: boolean
    onHide: () => void
    onDelete?: () => void
}

const DeleteOfferingModal: React.FC<DeleteOfferingModalProps> = ({ show, onHide, onDelete }) => {
  return (
    <Modal
      show={show}
      backdrop="static"
      onHide={onHide}
    >
      <StyledHeader closeButton>
          Delete subject?
      </StyledHeader>
      <StyledBody>
        <p>Are you sure you want to permanently delete this subject? Once deleted, all data within this subject will be lost.</p>
        <p>You can’t undo this action.</p>
        <ControlsWrapper>
          <Controls>
            <Button variant="default" size="lg" onClick={onDelete}>
                  Yes, delete
            </Button>
            <Button variant="primary" size="lg" onClick={onHide}>
                  Cancel
            </Button>
          </Controls>
        </ControlsWrapper>
      </StyledBody>
    </Modal>
  )
}

const DeleteOfferingWarningModal: React.FC<DeleteOfferingModalProps> = ({ show, onHide }) => {
    return (
      <Modal
        show={show}
        backdrop="static"
        onHide={onHide}
      >
        <StyledHeader closeButton className="warning">
            <Icon type="exclamation-triangle" />Subject cannot be deleted
        </StyledHeader>
        <StyledBody>
          <p>This subject cannot be removed since there are students enrolled in one or more courses.</p>
          <p className="note">Tip: Within this subject, you can still delete individual courses that have no students enrolled in them.</p>
          <ControlsWrapper>
            <Controls>
              <Button variant="default" size="lg" onClick={onHide}>
                    Okay
              </Button>
            </Controls>
          </ControlsWrapper>
        </StyledBody>
      </Modal>
    )
  }

export { DeleteOfferingModal, DeleteOfferingWarningModal }
