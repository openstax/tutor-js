import { React, styled, observer, PropTypes, useEffect } from 'vendor';
import { Modal, Form, Button } from 'react-bootstrap';
import AddEditQuestionModal from '../../course-modal';
import AddEditQuestionFormTopic from './topic';
import AddEditQuestionFormQuestion from './question';
import AddEditQuestionFormTags from './tags';
import AddEditQuestionFormGeneral from './general';
import AddEditQuestionUX from '../ux';
import { colors } from 'theme';

const StyledAddEditQuestionModal = styled(AddEditQuestionModal)`
    .modal-dialog {
        margin: 4rem auto;
        max-width: 1200px;
    }
    .modal-body {
      form > div:not(:first-child) {
        margin-top: 4rem;
      }
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
        onClick={() => ux.setShowPreviewQuestionModal(true)}
        disabled={!ux.isReadyToPublish}>
      Preview
    </Button>;

    // if editing
    if (ux.from_exercise_id) {
        return (
            <>
                {previewButton}
                <Button
                    variant="default"
                    className="cancel"
                    onClick={ux.doExitForm}>
          Cancel
                </Button>
                <Button
                    variant="primary"
                    data-test-id="publish-btn"
                    onClick={() => ux.publish(true)}
                    disabled={!ux.isReadyToPublish || !ux.hasAnyChanges}>
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
                onClick={() => ux.publish(false)}
                disabled={!ux.isReadyToPublish}>
        Publish question
            </Button>
            <Button
                variant="primary"
                className="publish"
                onClick={() => ux.publish(true)}
                disabled={!ux.isReadyToPublish}>
        Publish &amp; Exit
            </Button>
        </>
    );
});
FormButtons.propTypes = {
    ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const AddEditQuestionForm = observer(({ ux }) => {
    useEffect(() => {
        ux.enableAutosave()

        return () => {
            ux.disableAutosave()
        }
    }, [])
    return (
        <StyledAddEditQuestionModal
            data-test-id="add-edit-question"
            show={true}
            backdrop="static"
            onHide={ux.doExitForm}
            templateType="addEditQuestion"
        >
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
AddEditQuestionForm.propTypes = {
    ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default AddEditQuestionForm;
