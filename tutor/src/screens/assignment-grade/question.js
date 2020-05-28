import { React, PropTypes, observer, styled } from 'vendor';
import { Icon } from 'shared';
import { Button } from 'react-bootstrap';
import { ExerciseNumber, Question } from '../../components/homework-questions';
import Answer from './answer';
import { colors } from 'theme';
import S from '../../helpers/string';

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
  border-bottom: 2px solid ${colors.neutral.pale};
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
  label {
    padding-right: 20px;
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
`;

const StyledQuestion = styled.div`
    border: 2px solid ${colors.neutral.pale};
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
`;
               
QuestionHeader.propTypes = {
  ux: PropTypes.object.isRequired,
};


const ExpandGradedWrapper = styled.div`
  display:flex;
  justify-content: space-between;

  & label {
    padding: 7px 2rem 0;
    font-weight: 700;
  }
`;

const ExpandGraded = observer(({ ux }) => {
  const stats = ux.selectedHeading.gradedStats;
  if (0 == stats.completed) {
    return null;
  }
  return (
    <ExpandGradedWrapper>
      <Button
        onClick={() => ux.expandGradedAnswers = !ux.expandGradedAnswers}
        variant="link"
      >
        {ux.expandGradedAnswers ? 'Hide' : 'Expand'} graded answers {ux.selectedHeading.gradedProgress}
      </Button>
      <label>Average Score: {ux.averageScoreForGradedStudents} out of {S.numberWithOneDecimalPlace(ux.selectedHeading.responseStats.totalPoints)}</label>
    </ExpandGradedWrapper>
  );
});


const AssignmentGradingQuestion = observer(({ ux }) => (
  <StyledQuestion>
    <QuestionHeader ux={ux} />
    <QuestionBody>
      <Question
        question={ux.selectedHeading ? ux.selectedHeading.question : null}
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
