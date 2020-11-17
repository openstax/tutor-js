import { React, observer, styled } from 'vendor';
import { Modal, Form } from 'react-bootstrap';
import AddEditQuestionModal from '../../course-modal';
import AddEditQuestionFormTopic from './topic';
import AddEditQuestionFormTags from './tags';
import AddEditQuestionFormGeneral from './general';

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
        <Form>
          <AddEditQuestionFormTopic ux={ux} />
          <AddEditQuestionFormTags ux={ux} />
          <AddEditQuestionFormGeneral ux={ux} />
        </Form>
      </Modal.Body>
    </StyledAddEditQuestionModal>
  );
});

export default AddEditQuestionForm;
