import { React, PropTypes, styled, css, observer, cn } from 'vendor';
import { map, partial } from 'lodash';
import { Button } from 'react-bootstrap';
import {
    AddEditQuestionFormBlock, AddEditFormTextInput, AnswerHTMLEditor, QuestionInfo,
} from './shared';
import AddEditQuestionUX from '../ux';
import CheckboxInput from '../../../components/checkbox-input';
import { colors, breakpoint } from 'theme';
import { Icon } from 'shared';

const fullWidthTablet = css`
  ${breakpoint.tablet`
      flex: 0 1 100%;
  `}
`;

const StyledQuestionForm = styled.div`
  .header-toggle {
      background-color: ${colors.white};
      .btn {
          padding: 1rem 5rem;
          color: ${colors.neutral.thin};
          background-color: ${colors.white};
          border: none;
          &.selected {
              background-color: ${colors.neutral.bright};
              color: ${colors.neutral.darker};
              font-weight: 500;
              border-top-right-radius: 1rem;
          }
          &:disabled {
              opacity: 1;
          }
          &:active {
              background-color: inherit;
              color: inherit;
              border-color: inherit;
          }
      }
  }
  .question-form {
    padding: 2.4rem 1.8rem;
    .mcq-info {
      margin-bottom: 2rem;
      color: ${colors.neutral.thin};
    }
    > div:not(.option-choices-wrapper) {
        display: flex;
        flex-flow: row wrap;
    }
    label, .left-side {
        flex: 0 1 9%;
    }
    .question-text,
    .detailed-solution,
    .question-answer-key,
    .right-side {
      flex: 0 1 70%;
      ${fullWidthTablet}
      .editor {
        flex: 1;
        &.limited {
          flex: 0 1 100%;
        }
      }
    }
    .question-text {
      margin-top: 1.6rem;
      margin-bottom: 0;
    }
    .question-answer-key {
      margin-top: 3.2rem;
    }
    .two-step-wrapper {
      .right-side {
        margin-top: 1rem;
        .two-step-label {
          line-height: 1rem;
        }
        .two-step-info {
          margin-top: -0.5rem;
          margin-left: 2.3rem;
          color: ${colors.neutral.thin};
        }
      }
      svg[data-icon="check-square"] {
        color: ${colors.neutral.std};
      }
      // overriding checkbox svg css
      svg[data-icon="question-circle"] {
        position: static;
        margin: 0.2rem 0.5rem;
        height: 1.4rem;
        width: 1.4rem;
      }
    }
    .context-info-wrapper {
      .left-side {
        color: ${colors.neutral.darker};
        font-weight: 700;
      }
      .right-side {
        color: ${colors.neutral.thin};
        .btn.btn-link {
          padding: 0 0.15rem;
          vertical-align: inherit;
        }
      }
    }
    .option-choices-wrapper {
      display: column;
      flex-flow: column wrap;
      margin-bottom: 2rem;
      > div {
        display: flex;
        flex-flow: row wrap;
        > div:not(.add-option-wrapper) {
          margin-top: 1rem;
        }
        .left-side {
          margin: 2rem 0;
          button {
            float: right;
            margin-right: 0.5rem;
            margin-top: 0.5rem;
            svg {
              height: 2.4rem;
              width: 2.4rem;
              color: ${colors.neutral.pale};
              border: 1px solid ${colors.neutral.pale};
              border-radius: 50%;
              &.is-correct {
                color: ${colors.green};
                border: 1px solid ${colors.green};
              }
              &.check-correct-empty {
                color: #ffafb9;
                border-radius: 40px;
                border: 2px solid ${colors.soft_red};
              }
            }
          }
        }
        .right-side {
          flex: 0 1 77%;
          [class*="question-option-"] {
            margin-bottom: 0.5rem;
          }
          [class*="question-feedback-"] {
            width: 90%;
          }
        }
        .option-icons {
          margin-top: 0.3rem;
          margin-left: 2.4rem;
          button svg {
            height: 1.4rem;
            color: ${colors.neutral.std};
          }
          button[disabled] {
            opacity: 0.4;
          }
        }
        .add-option {
          padding: 0;
          color: ${colors.cerulan};
          font-weight: 700;
        }
      }
      .check-correct-error {
        margin: 1rem 0 0 7.5rem;
        color: ${colors.strong_red};
      }
    }
  }
`;

const Form = observer(({ ux }) => {
    const twoStepLabel =
    <>
        <span className="two-step-label">Make this Two-step question </span>
        <QuestionInfo
            placement="right"
            popoverInfo={
                <>
                    <p>
              A two-step question requires students to recall an answer from memory
              before viewing the multiple-choice options.
              Our research shows that retrieval practice helps to improve knowledge retention.
                    </p>
                    <p>
              Students will be graded only on the multiple-choice step.
              You can view student reponses in the ‘Submission overview’ tab.
                    </p>
                </>
            }/>
    </>;

    const renderOptions = () => map(ux.options, (o, index) =>
        <div className="options-feedback" key={index}>
            <div className="left-side">
                <Icon
                    type="check-circle"
                    className={cn({ 'is-correct': o.isCorrect, 'check-correct-empty': ux.isEmpty.correctOption })}
                    onClick={() => ux.checkCorrectOption(index)}
                    buttonProps={{ disabled: o.isCorrect }}/>
            </div>
            <div className="right-side">
                <AddEditFormTextInput
                    onChange={(value) => ux.changeOptions(value, index)}
                    value={o.text}
                    className={`question-option-${index + 1}`}
                    errorInfo={index <= 1 && ux.isEmpty.options[index] ? 'Add at least two options' : ''}
                />
                <AddEditFormTextInput
                    onChange={(value) => ux.changeFeedback(value, index)}
                    value={o.feedback}
                    placeholder='Add Feedback'
                    className={`question-feedback-${index + 1}`}
                />
            </div>
            <div className="option-icons">
                <Icon
                    type="arrow-up"
                    onClick={() => ux.moveUpOption(index)}
                    buttonProps={{ disabled: index === 0 }}/>
                <Icon
                    type="arrow-down"
                    onClick={() => ux.moveDownOption(index)}
                    buttonProps={{ disabled: index === ux.options.length - 1 }}/>
                <Icon
                    type="trash"
                    onClick={() => ux.deleteOption(index)}
                    buttonProps={{ disabled: ux.options.length <= 2 }}/>
            </div>
        </div>
    );

    const renderAddOptionButton = () => {
        if(ux.options.length >= 6) return null;
        return (
            <div className="add-option-wrapper">
                <div className="left-side"></div>
                <Button
                    variant="link"
                    className="add-option"
                    onClick={ux.addOption}>
             Add option
                </Button>
            </div>
        );
    };

    const renderQuestionInfo = () => {
    // if isMCQ is true, show MCQ form; otherwise show WRQ form
        if(!ux.isMCQ) {
            return (
                <AnswerHTMLEditor
                    onImageUpload={ux.onImageUpload}
                    onChange={ux.changeDetailedSolution}
                    html={ux.detailedSolution}
                    label='Answer Key'
                    placeholder="Enter a sample answer or a detailed solution. This is not visible to students."
                    className="question-answer-key"
                />
            );
        }
        return (
            <>
                <div className="two-step-wrapper">
                    <div className="left-side"></div>
                    <div className="right-side">
                        <CheckboxInput
                            onChange={ux.changeIsTwoStep}
                            label={twoStepLabel}
                            checked={ux.isTwoStep}
                            standalone
                        />
                        <p className="two-step-info">
            Ask students to answer in their own words before displaying the multiple-choice options.
                        </p>
                    </div>
                </div>
                <div className="option-choices-wrapper">
                    {ux.isEmpty.correctOption && <p className="check-correct-error">Check correct option</p>}
                    {renderOptions()}
                    {renderAddOptionButton()}
                </div>
                <AnswerHTMLEditor
                    onImageUpload={ux.onImageUpload}
                    onChange={ux.changeDetailedSolution}
                    html={ux.detailedSolution}
                    label='Detailed solution'
                    placeholder="Optional."
                    className="detailed-solution"
                />
            </>
        );
    };

    const contextInfo = () => {
        if(!ux.fromExercise || !ux.fromExercise.context) {
            return null;
        }

        return (
            <div className="context-info-wrapper">
                <div className="left-side">Context</div>
                <div className="right-side">
                    This question comes with media.
                    <Button variant="link" onClick={() => ux.showPreviewQuestionModal(true)}>Preview</Button>
                    to see it.
                </div>
            </div>
        );
    };

    return (
        <>
            { ux.isMCQ && <p className="mcq-info">Add question, multiple distractors, and check the correct answer.</p> }
            {contextInfo()}
            <AnswerHTMLEditor
                onImageUpload={ux.onImageUpload}
                onChange={ux.changeQuestionText}
                html={ux.questionText}
                label='Question'
                placeholder="Enter question or problem statement."
                className="question-text"
                errorInfo={ux.isEmpty.questionText ? 'Question field cannot be empty' : ''}
            />
            {renderQuestionInfo()}
        </>
    );
});
Form.propTypes = {
    ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const QuestionForm = observer(({ ux }) => {
    // if editing, only show the button type only.
    const renderButtonsPanel = () => {
        let buttons;
        const isEditing = ux.from_exercise_id;
        if(!isEditing || ux.isMCQ) {
            buttons =
        <Button
            variant="light"
            className={cn({ 'selected': ux.isMCQ })}
            onClick={() => ux.isMCQ = true}
            disabled={ux.isMCQ}>
          Multiple-choice question
        </Button>;
        }
        if(!isEditing || !ux.isMCQ) buttons =
      <>
          {buttons}
          <Button
              variant="light"
              className={cn({ 'selected': !ux.isMCQ })}
              onClick={() => ux.isMCQ = false}
              disabled={!ux.isMCQ}>
          Written-response question
          </Button>
      </>;
        return buttons;
    };
    return (
        <StyledQuestionForm>
            <div className="header-toggle">
                {renderButtonsPanel()}
            </div>
            <div className="question-form">
                <Form ux={ux} />
            </div>
        </StyledQuestionForm>
    );
});
QuestionForm.propTypes = {
    ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const Question = observer(({ ux }) => {
    return (
        <AddEditQuestionFormBlock
            label="Question"
            showGrayBackground={true}
            addPadding={false}
            onFocus={partial(ux.checkValidityOfFields, ['selectedChapter', 'selectedChapterSection'])}
            formContentRenderer={() => <QuestionForm ux={ux}/>}
        />
    );
});
Question.propTypes = {
    ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default Question;
