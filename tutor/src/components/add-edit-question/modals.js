import { React, PropTypes, styled, observer } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { map, find } from 'lodash';
import { colors } from 'theme';
import { Question, ArbitraryHtmlAndMath } from 'shared';
import AddEditQuestionUX from './ux';
import QuestionModel from '../../../../shared/src/model/exercise/question';

const PreviewModal = styled(Modal)`
  .modal-dialog {
    min-width: 800px;
  }
  .modal-body {
    .context {
      color: ${colors.neutral.thin};
    }
    textarea {
      width: 100%;
      min-height: 10.5em;
      line-height: 1.5em;
      margin: 2.5rem 0 0 0;
      padding: 0.5em;
      border: 1px solid ${colors.neutral.std};
      color: ${colors.neutral.dark};
      background-color: ${colors.neutral.cool};
    }
  }
`;

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

const QuestionPreviewModal = observer(({ ux }) => {
  if(!ux.showPreviewQuestionModal) return null;
  
  const question = new QuestionModel({
    stem_html: ux.questionText,
    answers: map(ux.filledOptions, o => {
      return {
        id: o.id,
        content_html: o.text,
        correctness: o.isCorrect ? '1.0' : '0.0',
        feedback_html: o.feedback,
      };
    }),
    formats: [ux.isMCQ ? 'multiple-choice' : 'free-response'],
  });
  //only OS questions has context
  const context = () => {
    if (!ux.exercise || !ux.exercise.context) return null;
    return (
      <ArbitraryHtmlAndMath className="context" block={true} html={ux.exercise.context} />
    );
  };

  let QuestionComponent;
  if (ux.isMCQ) {
    const correctAnswer = find(ux.filledOptions, o => o.isCorrect);
    QuestionComponent =
      <>
        <Question
          question={question}
          answer_id={correctAnswer ? correctAnswer.id : null}
          correct_answer_id={correctAnswer ? correctAnswer.id : null}
        />
        {
          ux.isTwoStep &&
          <textarea
            placeholder="Enter your response..."
            aria-label="question response text box"
            readOnly />
        }
        
      </>;
  }
  else {
    QuestionComponent = 
      <>
        <Question question={question}/>
        <textarea
          placeholder="Enter your response..."
          aria-label="question response text box"
          readOnly />
      </>
    ;
  }

  return (
    <PreviewModal
      show={ux.showPreviewQuestionModal}
      backdrop="static"
      onHide={() => ux.showPreviewQuestionModal = false}>
      <StyledHeader closeButton>
        Question Preview
      </StyledHeader>
      <StyledBody>
        {context()}
        {QuestionComponent}
      </StyledBody>
    </PreviewModal>
  );
});

export { FeedbackTipModal, ExitWarningModal, CoursePreviewOnlyModal, QuestionPreviewModal };
