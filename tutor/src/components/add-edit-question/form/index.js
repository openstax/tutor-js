import { React, styled, observer } from 'vendor';
import { Modal, Form, Button } from 'react-bootstrap';
import AddEditQuestionModal from '../../course-modal';
import AddEditQuestionFormTopic from './topic';
import AddEditQuestionFormQuestion from './question';
import AddEditQuestionFormTags from './tags';
import AddEditQuestionFormGeneral from './general';
import { colors } from 'theme';

const StyledAddEditQuestionModal = styled(AddEditQuestionModal)`
    .modal-dialog {
        margin: 4rem auto;
        max-width: 95%;
    }
    .modal-body {
      label {
        color: ${colors.neutral.darker};
        font-weight: 700;
      }
      .buttons-wrapper {
        float: right;
        .btn + .btn {
          margin-left: 1.6rem;
        }
        .btn {
          font-weight: 700;
          padding: 0.75rem 4rem;
          :not(.btn-primary) {
            color: ${colors.neutral.grayblue};
          }
        }
      }
    }
`;

const FormButtons = observer(({ ux }) => {
  const previewButton = 
    <Button
      variant="default"
      className="preview"
      onClick={() => window.alert('preview')}>
        Preview
    </Button>;

  // if editing
  if(ux.from_exercise_id) {
    return (
      <>
        {previewButton}
        <Button
          variant="default"
          className="cancel"
          onClick={() => window.alert('cancel')}>
            Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => window.alert('publishing changes')}>
            Publish changes
        </Button>
      </>
    );
  }
  // otherwise it is creating
  return (
    <>
      {previewButton}
      <Button
        variant="default"
        className="publish"
        onClick={() => window.alert('publish')}>
          Publish question
      </Button>
      <Button
        variant="primary"
        className="publish"
        onClick={() => window.alert('publish and exit')}>
          Publish &amp; Exit
      </Button>
    </>
  );
});

const AddEditQuestionForm = observer(({ ux }) => {
  return (
    <StyledAddEditQuestionModal
      show={true}
      backdrop="static"
      onHide={() => ux.onDisplayModal(false)}
      templateType="addEditQuestion">
      <Modal.Header closeButton>
        {ux.from_exercise_id ? 
          !ux.isUserGeneratedQuestion ? 'Copy & Edit' : 'Edit'
          : 'Create'} Question
      </Modal.Header>
      <Modal.Body>
        <Form>
          <AddEditQuestionFormTopic ux={ux} />
          <AddEditQuestionFormQuestion ux={ux} />
          <AddEditQuestionFormTags ux={ux} />
          <AddEditQuestionFormGeneral ux={ux} />
          <div className="buttons-wrapper">
            <FormButtons ux={ux} />
          </div>
        </Form>
      </Modal.Body>
    </StyledAddEditQuestionModal>
  );
});

export default AddEditQuestionForm;
