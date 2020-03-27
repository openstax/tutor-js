import { React, PropTypes, styled, useObserver } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import TutorLink from '../../components/link';
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

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  font-size: 1.6rem;
`;

const Right = styled.div`

`;

const GradeButton = styled(TutorLink).attrs({
  to: 'gradeAssignment',
  className: 'btn btn-form-action btn-primary btn-new-flag',
})`
  && {
    padding: 1.2rem 2.1rem 1.6rem 1.1rem;
    line-height: 1.9rem;
  }
`;

const StyledTooltip = styled(Tooltip)`
  max-width: 30rem;
  &.tooltip.show { opacity: 1; }

  .tooltip-inner {
    padding: 2.2rem 1.6rem;
    text-align: left;
  }
`;

const AvailablePoints = ({ value }) => {
  if (!value) {
    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <StyledTooltip>
            Students received different numbers of Tutor-selected questions. This can happen when questions aren’t
            available, a student works an assignment late, or a student hasn’t started the assignment.
          </StyledTooltip>
        }
      >
        <Icon variant="infoCircle" />
      </OverlayTrigger>
    );
  }
  return (
    <strong>({S.numberWithOneDecimalPlace(value)})</strong>
  );
};
AvailablePoints.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

const Overview = ({ ux, ux: { scores } }) => {
  return useObserver(() => (
    <Wrapper data-test-id="overview">
      <Toolbar>
        <Center>
          This assignment is now open for grading.
        </Center>
        <Right>
          <GradeButton variant="primary" className="btn-new-flag">
            <span className="flag">72 New</span>
            <span>Grade answers</span>
          </GradeButton>
        </Right>
      </Toolbar>
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
          <Header>
            Available Points <AvailablePoints value={scores.hasEqualTutorQuestions && scores.questionsInfo.totalPoints} />
          </Header>
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
