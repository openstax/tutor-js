import { React, PropTypes, styled, useObserver } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import S from '../../helpers/string';
import { Icon } from 'shared';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import { colors } from 'theme';
import Loading from 'shared/components/loading-animation';

// https://projects.invisionapp.com/d/main#/console/18937568/403651098/preview

const Wrapper = styled.div`
  margin-top: 4rem;
`;

const ControlsWrapper = styled.div`

`;

const QuestionHeader = ({ ux, styleVariant, label, info }) => useObserver(() => {
  return (
    <>
      <ExerciseNumber variant={styleVariant}>
        {info.hasFreeResponse && (
          <Icon
            type={ux.isShowingFreeResponseForQuestion(info.question) ? 'caret-down' : 'caret-right'}
            onClick={() => ux.toggleFreeResponseForQuestion(info.question)}
          />)}
        {label}
      </ExerciseNumber>
      <ControlsWrapper>{S.numberWithOneDecimalPlace(info.points)} Points</ControlsWrapper>
    </>
  );
});

QuestionHeader.propTypes = {
  styleVariant: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  info:  PropTypes.object.isRequired,
};


const StyledQuestionFreeResonse = styled.div`
  border-bottom: 1px dashed ${colors.neutral.thin};
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  b { margin-right: 1rem; }
`;

const QuestionFreeResponse = ({ ux, info }) => useObserver(() => {
  if (!ux.isShowingFreeResponseForQuestion(info.question)) { return null; }

  return (
    <div data-test-id="student-free-responses">
      {ux.scores.students.map((student, i) => {
        const studentQuestion = student.questions.find(sq => sq.id == info.question.id);
        return (studentQuestion && studentQuestion.free_response) && (
          <StyledQuestionFreeResonse key={i} data-student-id={student.id}>
            <b>{student.name}:</b>
            {studentQuestion.free_response}
          </StyledQuestionFreeResonse>
        );
      })}
    </div>
  );
});

const StyledStickyTable = styled(StickyTable)`
  .sticky-table-table {
    border: 1px solid ${colors.neutral.pale};
    border-bottom-width: 0;
  }

  .sticky-table-cell, .sticky-table-row {
    vertical-align: middle;
    padding: 0 1.6rem;
    height: 4.1rem;
    border-color: ${colors.neutral.pale};
  }
`;

const Header = styled(Cell)`
  background: ${colors.assignments.submissions.background};
  color: ${colors.neutral.grayblue};
  ${props => props.center && 'text-align: center;'}
`;

const Legend = styled.div`
  margin: 0.8rem 0;
  color: ${colors.neutral.thin};
`;

const Overview = ({ ux, ux: { scores } }) => {

  return useObserver(() => (
    <Wrapper data-test-id="overview">
      <StyledStickyTable>
        <Row>
          <Header>Question Number</Header>
          {scores.question_headings.map((h, i) => <Header key={i} center={true}>{h.title}</Header>)}
        </Row>
        <Row>
          <Header>Question Type</Header>
          {scores.question_headings.map((h, i) => <Cell key={i}>{h.type}</Cell>)}
        </Row>
        <Row>
          <Header>Available Points</Header>
          {scores.question_headings.map((h, i) => <Cell key={i}>{S.numberWithOneDecimalPlace(h.points)}</Cell>)}
        </Row>
        <Row>
          <Header>Correct Responses</Header>
          {scores.question_headings.map((h, i) => <Cell key={i}>{h.responseStats.points} / {h.responseStats.totalPoints}</Cell>)}
        </Row>
      </StyledStickyTable>
      <Legend>
        MCQ: Multiple Choice Question (auto-graded);
        WRQ: Written Response Question (manually-graded);
        Tutor: Personalized questions assigned by OpenStax Tutor (MCQs & auto-graded)
      </Legend>

      {ux.isExercisesReady ? (
        <HomeworkQuestions
          questionsInfo={scores.questionsInfo}
          questionType="teacher-review"
          headerContentRenderer={(props) => <QuestionHeader ux={ux} {...props} />}
          questionInfoRenderer={(props) => <QuestionFreeResponse ux={ux} {...props} />}
          styleVariant="submission"
        />) : <Loading message="Loading Questions…"/>}

    </Wrapper>
  ));
};
Overview.title = 'Submission Overview';
Overview.propTypes = {
  ux: PropTypes.object.isRequired,
};


export default Overview;
