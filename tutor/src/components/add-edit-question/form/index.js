import { React, observer, styled } from 'vendor';
import { Formik } from 'formik';
import { Modal } from 'react-bootstrap';
import AddEditQuestionModal from '../../course-modal';
import AddEditQuestionFormTopic from './topic';

const StyledAddEditQuestionModal = styled(AddEditQuestionModal)`
    .modal-dialog {
        margin: 4rem auto;
        max-width: 95%;
    }
`;

const AddEditQuestionForm = observer(({ ux }) => {
  return (
    <StyledAddEditQuestionModal
      show={ux.showForm}
      backdrop="static"
      onHide={() => ux.setShowForm(false)}
      templateType="addEditQuestion">
      <Modal.Header closeButton>
        Create Question
      </Modal.Header>
      <Modal.Body>
        <Formik>
          <AddEditQuestionFormTopic ux={ux} />
        </Formik>
      </Modal.Body>
    </StyledAddEditQuestionModal>
  );
});

export default AddEditQuestionForm;
