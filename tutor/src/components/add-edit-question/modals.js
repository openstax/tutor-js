import { React, PropTypes, styled, observer, useState, useEffect } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { map, find, isEmpty } from 'lodash';
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
    .btn.btn-primary {
      float: right;
      margin-top: 1rem;
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
    // dont show answers yet when it is a two-step question
    const [showAnswers, setshowAnswers] = useState(!ux.isTwoStep);
    const [freeResponseText, setFreeReponseText] = useState('');

    useEffect(() => {
        setshowAnswers(!ux.isTwoStep);
    }, [ux.isTwoStep]);

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
        if (!ux.fromExercise || !ux.fromExercise.context) return null;
        return (
            <ArbitraryHtmlAndMath className="context" block={true} html={ux.fromExercise.context} />
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
              hideAnswers={!showAnswers}
          />
          {
              !showAnswers &&
          <>
              <textarea
                  placeholder="Enter your response..."
                  aria-label="question response text box"
                  value={freeResponseText}
                  onChange={({ target: { value } }) => setFreeReponseText(value)} />
              <Button
                  size="lg"
                  disabled={isEmpty(freeResponseText.trim())}
                  onClick={() => setshowAnswers(true)}
              >
              Submit
              </Button>
          </>
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

const DeleteExerciseModal = ({ show, onHide, onDelete }) => {
    return (
        <Modal
            show={show}
            backdrop="static"
        >
            <StyledHeader>
          Delete Question?
            </StyledHeader>
            <StyledBody>
                <p>Are you sure you want to permanently delete this question? Question <strong>will not</strong> be deleted from any open assignments.</p>
                <p>You can’t undo this action.</p>
                <p className="note">Tip: To exclude a bad question from an open assignment, drop it from the assignment details page.</p>
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
    );
};
DeleteExerciseModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export {
    FeedbackTipModal,
    ExitWarningModal,
    CoursePreviewOnlyModal,
    QuestionPreviewModal,
    DeleteExerciseModal };
