import { React, PropTypes, styled, css, observer, cn } from 'vendor';
import { useState } from 'react';
import { Form, Dropdown, Button } from 'react-bootstrap';
import AddEditQuestionFormBlock, { AddEditFormTextInput } from './shared';
import TutorDropdown from '../../dropdown';
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
        label {
            flex: 0 1 9%;
            margin: auto 0;
        }
        .question-text {
            .form-control {
                flex: 0 1 70%;
                ${fullWidthTablet}
            }
        }
    }
`;

const MCQForm = observer(({ ux }) => {
  return <div>MCQ form</div>;
});

const WRQForm = observer(({ ux }) => {
  return (
    <AddEditFormTextInput
      onChange={ux.changeQuestionText}
      value={ux.questionText}
      label='Question'
      placeholder="Enter question or problem statement."
      className="question-text"
    />
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
