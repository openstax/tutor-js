import { React, PropTypes, styled, css, observer, cn } from 'vendor';
import { map, partial } from 'lodash';
import { Button } from 'react-bootstrap';
import { AddEditQuestionFormBlock, AddEditFormTextInput, QuestionInfo } from './shared';
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
    > div:not(.option-choices-wrapper) {
        display: flex;
        flex-flow: row wrap;
    }
    label, .left-side {
        flex: 0 1 9%;
        margin: auto 0;
    }
    .question-text .form-control,
    .question-answer-key .form-control,
    .detailed-solution .form-control,
    .right-side {
      flex: 0 1 70%;
      ${fullWidthTablet}
    }
    .question-text {
      margin-top: 1.6rem;
    }
    .question-answer-key {
      margin-top: 3.2rem;
    }
    .two-step-wrapper {
      .right-side {
        .two-step-label {
          margin-left: 1rem;
          line-height: 3rem;
        }
        .two-step-info {
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
        margin: 0 0.5rem;
        height: 1.4rem;
        width: 1.4rem;
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
              font-size: 2rem;
              color: ${colors.neutral.pale};
              &.is-correct {
                color: ${colors.green};
              }
            }
          }
        }
        .right-side {
          [class*="question-option-"] {
            margin-bottom: 0.5rem;
          }
          [class*="question-feedback-"] {
            width: 90%;
            line-height: 0;
          }
        }
        .option-icons {
          margin-top: 0.3rem;
          margin-left: 2.4rem;
          button svg {
            color: ${colors.neutral.std};
          }
        }
        .add-option {
          padding: 0;
          color: ${colors.cerulan};
          font-weight: 700;
        }
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
    <div key={index}>
      <div className="left-side">
        <Icon
          type="check-circle"
          className={cn({ 'is-correct': o.isCorrect })}
          onClick={() => ux.checkCorrectOption(index)}
          buttonProps={{ disabled: o.isCorrect }}/>
      </div>
      <div className="right-side">
        <AddEditFormTextInput
          onChange={({ target: { value } }) => ux.changeOptions(value, index)}
          value={o.text}
          placeholder={`Add Option ${index + 1}`}
          className={`question-option-${index + 1}`}
        />
        <AddEditFormTextInput
          onChange={({ target: { value } }) => ux.changeFeedback(value, index)}
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
        <AddEditFormTextInput
          onChange={ux.changeDetailedSolution}
          value={ux.detailedSolution}
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
          {renderOptions()}
          {renderAddOptionButton()}
        </div>
        <AddEditFormTextInput
          onChange={ux.changeDetailedSolution}
          value={ux.detailedSolution}
          label='Detailed solution'
          placeholder="Optional. This is not visible to students."
          className="detailed-solution"
        />
      </>
    );
  };

  return (
    <>
      <AddEditFormTextInput
        onChange={ux.changeQuestionText}
        value={ux.questionText}
        label='Question'
        placeholder="Enter question or problem statement."
        className={cn('question-text', { 'isEmpty': ux.isEmpty.questionText })}
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
