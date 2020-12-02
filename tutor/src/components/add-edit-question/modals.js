import { React, PropTypes, styled, observer } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { colors } from 'theme';
import AddEditQuestionUX from './ux';

const StyledHeader = styled(Modal.Header)`
  font-weight: bold;
  font-size: 1.8rem;
  padding: 2.5rem 3rem;
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
`;


const FeedbackTipModal = observer(({ ux }) => {
  return (
    <Modal
      show={ux.feedbackTipModal.show}
      backdrop="static"
    >
      <StyledHeader>
        Tip: Add feedback!
      </StyledHeader>
      <StyledBody>
        <p>Add explanatory feedback for the answer choices. Students learn better when they recieve immediate and specific feedback.</p>
        <p className="note">Note: Ideally, this feedback should anticipate common misconceptions or calculation errors.</p>
        <ControlsWrapper>
          <Controls>
            <Button variant="default" size="lg" onClick={() => ux.doPublish(ux.feedbackTipModal.shouldExitOnPublish)}>
              Publish anyway
            </Button>
            <Button variant="primary" size="lg" onClick={() => ux.feedbackTipModal.show = false}>
              Add feedback
            </Button>
          </Controls>
        </ControlsWrapper>
      </StyledBody>
    </Modal>
  );
});
FeedbackTipModal.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const ExitWarningModal = observer(({ ux }) => {
  return (
    <Modal
      show={ux.showExitWarningModal}
      backdrop="static"
    >
      <StyledHeader>
        Exit without publishing?
      </StyledHeader>
      <StyledBody>
        <p>The question is not published yet and will not be saved. Are you sure you want to exit this form?</p>
        <ControlsWrapper>
          <Controls>
            <Button variant="default" size="lg" onClick={() => {
              ux.showExitWarningModal = false;
              ux.onDisplayModal(false);
            }}>
                Yes, exit
            </Button>
            <Button variant="primary" size="lg" onClick={() => ux.showExitWarningModal = false}>
                Cancel
            </Button>
          </Controls>
        </ControlsWrapper>
      </StyledBody>
    </Modal>
  );
});
ExitWarningModal.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const CoursePreviewOnlyModal = observer(({ onDisplayModal }) => {
  return (
    <Modal
      show={true}
      backdrop="static"
      onHide={() => onDisplayModal(false)}>
      <StyledHeader closeButton>
        This is a demo course!
      </StyledHeader>
      <StyledBody>
        <p>Adding or editing a question is <strong>not allowed</strong> in a demo course. 
            You can create a live course to add or edit questions.</p>
        <ControlsWrapper>
          <Controls>
            <Button variant="primary" size="lg" onClick={() => onDisplayModal(false)}>
                Okay
            </Button>
          </Controls>
        </ControlsWrapper>
      </StyledBody>
    </Modal>
  );
});
CoursePreviewOnlyModal.propTypes = {
  onDisplayModal: PropTypes.func.isRequired,
};

export { FeedbackTipModal, ExitWarningModal, CoursePreviewOnlyModal };
