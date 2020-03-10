import { React, PropTypes, styled, useObserver } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import ExerciseType from './exercise-type';
import S from '../../helpers/string';
import HomeworkQuestions from '../../components/homework-questions';

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

const Overview = ({ ux: { plan, scores } }) => {
  return useObserver(() => (
    <Wrapper>
      <StickyTable>
        <Row>
          <Cell>Question Number</Cell>
          {plan.exerciseIds.map((exId, i) => <Cell key={i}>Q{i + 1}</Cell>)}
        </Row>
        <Row>
          <Cell>Question Type</Cell>
          {plan.questionsInfo.map((info) => <Cell key={info.key}><ExerciseType exercise={info.exercise} /></Cell>)}
        </Row>
        <Row>
          <Cell>Available Points</Cell>
          {plan.questionsInfo.map(({ points, key }) => <Cell key={key}>{S.numberWithOneDecimalPlace(points)}</Cell>)}
        </Row>
        <Row>
          <Cell>Correct Responses</Cell>
          {scores.questionsInfo.map(({ key, stats }) => <Cell key={key}>{stats.answer_stats.correct.selected_count} / {stats.answered_count}</Cell>)}
        </Row>
      </StickyTable>

      <HomeworkQuestions
        questionsInfo={scores.questionsInfo}
        questionType="teacher-review"
        controlsComponent={QuestionControls}
      />

    </Wrapper>
  ));
};
Overview.title = 'Submission Overview';
Overview.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Overview;
