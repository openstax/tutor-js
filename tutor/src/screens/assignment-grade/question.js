import { React, PropTypes, observer, styled, css } from 'vendor';
import { concat } from 'lodash';
import { Button } from 'react-bootstrap';
import { ExerciseNumber, Question } from '../../components/homework-questions';
import Answer from './answer';
import { colors } from 'theme';
import ScoresHelper from '../../helpers/scores';

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
  color: ${colors.neutral.darker};
  font-weight: 600;
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
  ${props => props.onClick && css`
      cursor: pointer;
    `}
`;

const QuestionHeader = observer(({ questionIndex, ux, showAnswerKey = false }) => (
    <StyledQuestionHeading onClick={() => ux.showOverview ? ux.goToQuestionHeading(questionIndex, ux.expandGradedAnswers) : undefined}>
        <ExerciseNumber>
        Question {questionIndex + 1}
        </ExerciseNumber>
        {showAnswerKey && <AnswerKey ux={ux} /> }
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
    ${props => props.marginBottom && css`
      margin-bottom: 10px;
    `}
`;

QuestionHeader.propTypes = {
    ux: PropTypes.object,
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
    let completed = ux.showOnlyAttempted ? ux.selectedHeading.gradedStats.completed : ux.selectedHeading.gradedStatsWithUnAttemptedResponses.completed;
    let gradeProgress =  ux.showOnlyAttempted ? ux.selectedHeading.gradedProgress : ux.selectedHeading.gradedProgressWithUnAttemptedResponses;
    if (0 == completed) {
        return null;
    }
    return (
        <ExpandGradedWrapper>
            <Button
                onClick={() => ux.expandGradedAnswers = !ux.expandGradedAnswers}
                variant="link"
            >
                {ux.expandGradedAnswers ? 'Hide' : 'Expand'} graded answers {gradeProgress}
            </Button>
            <label>
        Average Score: {
                    ScoresHelper.formatPoints(
                        ux.selectedHeading.dropped
                            ? ux.selectedHeading.averageGradedPointsWithDroppedQuestion
                            : ux.selectedHeading.averageGradedPoints
                    )
                } out of {ScoresHelper.formatPoints(ux.selectedHeading.points_without_dropping)}
            </label>
        </ExpandGradedWrapper>
    );
});

const Overiew = observer(({ ux }) => {
    return (
    <>
      {
          ux.headings.map((h, i) => (
              <StyledQuestion key={i} marginBottom>
                  <QuestionHeader questionIndex={i} ux={ux} />
                  <QuestionBody>
                      <Question
                          question={h.question}
                          hideAnswers={false}
                          displaySolution={false}
                          choicesEnabled={false}
                          displayFormats={false}
                      />
                      <ExpandGradedWrapper>
                          <Button
                              onClick={() => ux.goToQuestionHeading(i, true)}
                              variant="link"
                          >
                  Expand graded answers {ux.showOnlyAttempted ? h.gradedProgress : h.gradedProgressWithUnAttemptedResponses}
                          </Button>
                          <label>
                  Average Score: {ScoresHelper.formatPoints(h.averageGradedPoints)} out of {ScoresHelper.formatPoints(h.responseStats.availablePoints)}
                          </label>
                      </ExpandGradedWrapper>
                  </QuestionBody>
              </StyledQuestion>
          ))
      }
    </>
    );
});

const IndividualQuestion = observer(({ ux }) => {
    let responses = ux.expandGradedAnswers
        ? concat(ux.gradedResponses, ux.needsGradingResponses)
        : ux.needsGradingResponses;
    return (
        <StyledQuestion>
            <QuestionHeader questionIndex={ux.selectedHeading.index} ux={ux} showAnswerKey={true} />
            <QuestionBody>
                <Question
                    question={ux.selectedHeading ? ux.selectedHeading.question : null}
                    hideAnswers={false}
                    displaySolution={ux.showAnswerKey}
                    choicesEnabled={false}
                    displayFormats={false}
                />
                <ExpandGraded ux={ux} />
                {responses.map((response, index) =>
                    <Answer
                        response={response}
                        key={index}
                        index={index}
                        ux={ux} />)}
            </QuestionBody>
        </StyledQuestion>
    );
});
const AssignmentGradingQuestion = observer(({ ux }) => {
    const Component = ux.showOverview ? Overiew : IndividualQuestion;

    return <Component ux={ux} />;
});

export default AssignmentGradingQuestion;
