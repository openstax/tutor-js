import { React, PropTypes, observer, styled } from 'vendor';
import { Icon } from 'shared';
import { Button } from 'react-bootstrap';
import { ExerciseNumber, Question } from '../../components/homework-questions';
import Answer from './answer';
import { colors } from 'theme';

const StyledIcon = styled(Icon)`
  font-size: 2.7rem;
`;

const AnswerKey = observer(({ ux }) => (
  <label>
    <input
      type="checkbox"
      checked={ux.showAnswerKey}
      onChange={({ target: { checked } }) => ux.showAnswerKey = checked}
    />
    Answer Key
  </label>
));

const StyledQuestionHeading = styled.div`
  background: ${colors.templates.homework.background};
  border: 1px solid ${colors.templates.homework.border};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  align-items: center;
  padding: 0 10px;
  color: ${colors.neutral.grayblue};
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > * {
    display: flex;
    align-items: center;
    > * { margin: 0 .5rem; }
  }
`;
      
const QuestionHeader = observer(({ ux }) => (
  <StyledQuestionHeading>
    <div>
      <StyledIcon type="caret-down" />
      <ExerciseNumber>
        Question {ux.selectedHeading.index + 1}
      </ExerciseNumber>
    </div>
    <AnswerKey ux={ux} />
  </StyledQuestionHeading>
));

const QuestionBody = styled.div`
  padding: 2rem;
  border-top: 0px;
  background-color: white;
  border: 1px solid ${colors.neutral.pale};
`;

const StyledQuestion = styled.div`
`;
               
QuestionHeader.propTypes = {
  ux: PropTypes.object.isRequired,
};


const StyledExpandGraded = styled(Button).attrs({
  variant: 'link',
})`

`;

const ExpandGraded = observer(({ ux }) => {
  const stats = ux.selectedHeading.gradedStats;
  if (0 == stats.completed) {
    return null;
  }
  return (
    <StyledExpandGraded
      onClick={() => ux.expandGradedAnswers = !ux.expandGradedAnswers}
    >
      {ux.expandGradedAnswers ? 'Hide' : 'Expand'} graded answers {ux.selectedHeading.gradedProgress}
    </StyledExpandGraded>
  );
});


const AssignmentGradingQuestion = observer(({ ux }) => (
  <StyledQuestion>
    <QuestionHeader ux={ux} />
    <QuestionBody>
      <Question
        question={ux.selectedHeading.question}
        hideAnswers={false}
        displaySolution={ux.showAnswerKey}
        choicesEnabled={false}
        displayFormats={false}
      />
      <ExpandGraded ux={ux} />
      {ux.visibleResponses.map((response, index) =>
        <Answer
          response={response}
          key={index} index={index}
          ux={ux} />)}
    </QuestionBody>
  </StyledQuestion>
));

export default AssignmentGradingQuestion;
