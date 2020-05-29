import { React, PropTypes, styled, observer, cn } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import TutorLink from '../../components/link';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import S from '../../helpers/string';
import { Icon, ArbitraryHtmlAndMath } from 'shared';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import { colors } from 'theme';
import Loading from 'shared/components/loading-animation';
import { isEmpty, compact } from 'lodash';

// https://projects.invisionapp.com/d/main#/console/18937568/403651098/preview

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const Wrapper = styled.div`
  margin-top: 4rem;
`;


const StyledIcon = styled(Icon)`
  font-size: 2.7rem;
`;

const QuestionHeader = observer(({ ux, styleVariant, label, info }) => (
  <>
    <ExerciseNumber variant={styleVariant}>
      {info.hasFreeResponse && (
        <StyledIcon
          type={ux.isShowingFreeResponseForQuestion(info.question) ? 'caret-down' : 'caret-right'}
          onClick={() => ux.toggleFreeResponseForQuestion(info.question)}
        />)}
      {label}
    </ExerciseNumber>
    <div>{S.numberWithOneDecimalPlace(info.points)} Points</div>
  </>
));


QuestionHeader.propTypes = {
  styleVariant: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  info:  PropTypes.object.isRequired,
};

const StyledQuestionFreeResponse = styled.div`
  margin-bottom: 1.6rem;
  display: flex;
  align-items: stretch;
  > * {
    padding-bottom: 1.6rem;
  }
  .name {
    align-self: flex-start;
    margin-right: 2.4rem;
    min-width: 15rem;
    width: 15rem;
    overflow-wrap: break-word;
    text-align: right;
    font-weight: normal;
    color: ${colors.neutral.thin};
  }
  .resp {
    flex-grow: 1;
    margin: 0;
    font-size: 1.6rem;
  }
  &:not(:only-child) .resp {
    border-bottom: 1px solid ${colors.neutral.light};
  }
`;

const ResponseWrapper = styled.div`
  border: 1px solid ${colors.neutral.pale};
  background: #fff;
  margin-bottom: 2rem;
  > * {
    padding: 1.8rem 5rem 1.8rem 2rem;
  }
`;

const ResponseHeader = styled.div`
  border-bottom: 1px solid ${colors.neutral.pale};
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  > *:first-child {
    margin-right: 1.6rem;
  }
`;

const MCQFreeResponse = observer(({ ux, question }) => (
  question.answers.map((answer, i) => {
    const responses = ux.scores.students.map((student, i) => {
      const studentQuestion = student.questions.find(sq => sq.selected_answer_id == answer.id);
      return (studentQuestion && studentQuestion.free_response) && (
        <StyledQuestionFreeResponse key={i} data-student-id={student.id}>
          <span className="name">{student.name}</span>
          <span className="resp">{studentQuestion.free_response}</span>
        </StyledQuestionFreeResponse>
      );
    });

    if (isEmpty(compact(responses))) { return null; }

    return (
      <ResponseWrapper key={`answer-${answer.id}`}>
        <ResponseHeader>
          <span className={cn('letter', { 'green': answer.isCorrect, 'red': !answer.isCorrect })}>
            {ALPHABET[i]}
          </span>
          <ArbitraryHtmlAndMath
            html={answer.content_html}
          />
        </ResponseHeader>
        <div>
          {responses}
        </div>
      </ResponseWrapper>
    );
  })
));

const WRQFreeResponse = observer(({ info }) => {
  const responses = info.responses.map((response, i) => {
    const student = response.student;
    return response.free_response && (
      <StyledQuestionFreeResponse key={i} data-student-id={student.id}>
        <span className="name">{student.name}</span>
        <span className="resp">{response.free_response}</span>
      </StyledQuestionFreeResponse>
    );
  });

  if (isEmpty(compact(responses))) { return null; }

  return (
    <ResponseWrapper key={`wrq-responses-${info.question.id}`}>
      <div>
        {responses}
      </div>
    </ResponseWrapper>
  );
});

const QuestionFreeResponse = observer(({ ux, info }) => {
  if (!ux.isShowingFreeResponseForQuestion(info.question)) { return null; }
  return (
    <div data-test-id="student-free-responses">
      {info.question.isMultipleChoice ? <MCQFreeResponse ux={ux} question={info.question} />
        : <WRQFreeResponse ux={ux} info={info} />}
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
  className: 'btn btn-standard btn-primary btn-new-flag',
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

const GradingBlock = observer(({ ux }) => {
  const { taskPlan } = ux.planScores;

  if (!taskPlan.canGrade) { return null; }

  return (
    <Toolbar>
      <Center>
        This assignment is now open for grading.
      </Center>
      <Right>
        <GradeButton
          variant="primary"
          params={{ courseId: ux.course.id, id: ux.planId }}
        >
          <span>Grade answers</span>
        </GradeButton>
      </Right>
    </Toolbar>
  );
});

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
    PropTypes.bool,
  ]),
};

const Overview = observer(({ ux, ux: { scores } }) => (
  <Wrapper data-test-id="overview">
    <GradingBlock ux={ux}/>
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
          Available Points <AvailablePoints value={(scores.hasEqualTutorQuestions && scores.questionsInfo.totalPoints) || false} />
        </Header>
        {scores.question_headings.map((h, i) => <Cell key={i}>{S.numberWithOneDecimalPlace(h.points)}</Cell>)}
      </Row>
      <Row>
        <Header>Correct Responses</Header>
        {scores.question_headings.map((h, i) => (
          <Cell key={i}>
            {h.gradedStats.remaining > 0 ? '---' : h.responseStats.correct} / {h.responseStats.completed}
          </Cell>
        ))}
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

Overview.title = 'Submission Overview';
Overview.propTypes = {
  ux: PropTypes.object.isRequired,
};


export default Overview;
