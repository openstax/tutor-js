import { React, observer, styled } from 'vendor';
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
          <AddEditQuestionFormQuestion ux={ux} />
          <AddEditQuestionFormTags ux={ux} />
          <AddEditQuestionFormGeneral ux={ux} />
          <div className="buttons-wrapper">
            <Button
                variant="default"
                className="cancel"
                onClick={() => console.log('PREVIEW')}>
                Preview
              </Button>
            <Button
              variant="default"
              className="cancel"
              onClick={() => console.log('PUBLISH')}>
              Publish question
            </Button>
            <Button
              variant="primary"
              onClick={() => console.log('PUBLISH & EXIT')}>
              Publish &amp; Exit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </StyledAddEditQuestionModal>
  );
});

export default AddEditQuestionForm;
