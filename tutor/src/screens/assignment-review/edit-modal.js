import { React, PropTypes, styled, observer } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import TemplateModal from '../../components/template-modal';
import { Formik } from 'formik';
import { colors } from 'theme';
import { AsyncButton } from 'shared';

const StyledTemplateModal = styled(TemplateModal)`
  && {
    .modal-body {
      padding: 0;
    }

    .modal-dialog {
      min-width: 100rem;
    }
  }
`;

const ControlsWrapper = styled.div`
  margin: 3rem 4rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 3.2rem;
  border-top: 1px solid ${colors.neutral.pale};
`;

const Controls = styled.div`
  .btn + .btn {
    margin-left: 1.5rem;
  }
`;

const EditModal = observer(({ ux, ux: {
  planScores, onSavePlan, onCancelEdit, editUX,
} }) => {
  return (
    <StyledTemplateModal
      show={true}
      onHide={onCancelEdit}
      backdrop="static"
      templateType={planScores.type}
    >
      <Modal.Header>
        Edit {planScores.name} details
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={editUX.formValues}
          validateOnMount={true}
        >
          {ux.renderDetails}
        </Formik>
        <ControlsWrapper>
          <Controls>
            <Button
              data-test-id="cancel-save-assignment"
              className="btn-standard btn-inline"
              variant="default"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
            <AsyncButton
              isWaiting={ux.submitPending}
              waitingText="Saving..."
              onClick={onSavePlan}
              disabled={!ux.canSubmit}
              className="btn-standard btn-inline"
              data-test-id="confirm-save-assignment"
            >Save changes</AsyncButton>
          </Controls>
        </ControlsWrapper>
      </Modal.Body>
    </StyledTemplateModal>
  );
});

EditModal.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default EditModal;
