import { React, PropTypes, styled, useObserver } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import ExerciseType from './exercise-type';
import S from '../../helpers/string';
import HomeworkQuestions from '../../components/homework-questions';
import { colors } from 'theme';

const Wrapper = styled.div`
  margin-top: 4rem;
`;

const ControlsWrapper = styled.div`

`;

const QuestionControls = ({ info }) => {
  return (
    <ControlsWrapper>{S.numberWithOneDecimalPlace(info.points)} Points</ControlsWrapper>
  );
};
QuestionControls.propTypes = {
  info:  PropTypes.object.isRequired,
};

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

const Overview = ({ ux: { plan, scores } }) => {
  return useObserver(() => (
    <Wrapper>
      <StyledStickyTable>
        <Row>
          <Header>Question Number</Header>
          {plan.exerciseIds.map((exId, i) => <Header key={i} center={true}>{i + 1}</Header>)}
        </Row>
        <Row>
          <Header>Question Type</Header>
          {plan.questionsInfo.map((info) => <Cell key={info.key}><ExerciseType exercise={info.exercise} /></Cell>)}
        </Row>
        <Row>
          <Header>Available Points</Header>
          {plan.questionsInfo.map(({ points, key }) => <Cell key={key}>{S.numberWithOneDecimalPlace(points)}</Cell>)}
        </Row>
        <Row>
          <Header>Correct Responses</Header>
          {scores.questionsInfo.map(({ key, stats }) => <Cell key={key}>{stats.answer_stats.correct.selected_count} / {stats.answered_count}</Cell>)}
        </Row>
      </StyledStickyTable>
      <Legend>
        MCQ: Multiple Choice Question (auto-graded);
        WRQ: Written Response Question (manually-graded);
        Tutor: Personalized questions assigned by OpenStax Tutor (MCQs & auto-graded)
      </Legend>

      <HomeworkQuestions
        questionsInfo={scores.questionsInfo}
        questionType="teacher-review"
        controlsComponent={QuestionControls}
        styleVariant="submission"
      />

    </Wrapper>
  ));
};
Overview.title = 'Submission Overview';
Overview.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Overview;
