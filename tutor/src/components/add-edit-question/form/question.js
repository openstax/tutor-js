import { React, PropTypes, styled, css, observer, cn } from 'vendor';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import AddEditQuestionFormBlock, { AddEditFormTextInput, QuestionInfo } from './shared';
import AddEditQuestionUX from '../ux';
import CheckboxInput from '../../../components/checkbox-input';
import { colors, breakpoint } from 'theme';

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
        > div {
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
    }
`;

const MCQForm = observer(({ ux }) => {
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
  return (
    <>
      <AddEditFormTextInput
        onChange={ux.changeQuestionText}
        value={ux.questionText}
        label='Question'
        placeholder="Enter question or problem statement."
        className="question-text"
      />
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
      <AddEditFormTextInput
        onChange={ux.changeDetailedSolution}
        value={ux.detailedSolution}
        label='Detailed solution'
        placeholder="Optional. This is not visible to students."
        className="detailed-solution"
      />
    </>
  );
});

const WRQForm = observer(({ ux }) => {
  return (
    <>
      <AddEditFormTextInput
        onChange={ux.changeQuestionText}
        value={ux.questionText}
        label='Question'
        placeholder="Enter question or problem statement."
        className="question-text"
      />
      <AddEditFormTextInput
        onChange={ux.changeAnswerKeyText}
        value={ux.answerKeyText}
        label='Answer Key'
        placeholder="Enter a sample answer or a detailed solution. This is not visible to students."
        className="question-answer-key"
      />
    </>
  );
});

const QuestionForm = observer(({ ux }) => {
  // if isMCQ is true, show MCQ form; otherwise show WRQ form
  const [isMCQ, setIsMCQ] = useState(true);
  const ComponentForm = isMCQ ? MCQForm : WRQForm;

  return (
    <StyledQuestionForm>
      <div className="header-toggle">
        <Button
          variant="light"
          className={cn({ 'selected': isMCQ })}
          onClick={() => setIsMCQ(true)}
          disabled={isMCQ}>
                Multiple-choice question
        </Button>
        <Button
          variant="light"
          className={cn({ 'selected': !isMCQ })}
          onClick={() => setIsMCQ(false)}
          disabled={!isMCQ}>
                Written-response question
        </Button>
      </div>
      <div className="question-form">
        <ComponentForm ux={ux} />
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
      formContentRenderer={() => <QuestionForm ux={ux}/>}
    />
  );
});
Question.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default Question;
