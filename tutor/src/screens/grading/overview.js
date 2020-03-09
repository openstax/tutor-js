import { React, PropTypes, styled, observer } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import S from '../../helpers/string';
import HomeworkQuestions from '../../components/homework-questions';

const Wrapper = styled.div`
  margin-top: 4rem;
`;

const ExerciseType = ({ exercise: { content } }) => {
  let type = 'unknown';
  if (content.isMultiPart) {
    type = 'MPQ';
  } else if (content.isWRM) {
    type = 'WRM';
  } else if (content.isSinglePart) {
    type = 'SPQ';
  }
  return <span>{type}</span>;
};
ExerciseType.propTypes = {
  exercise: PropTypes.object.isRequired,
};

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

const Overview = observer(({ ux: { plan, stats } }) => {
  const planInfo = plan.questionsInfo;
  planInfo.forEach(pi => {
    pi.stats = stats.statsForQuestion(pi.question);
    pi.question = pi.stats.forReview;
  });

  return (
    <Wrapper>
      <StickyTable>
        <Row>
          <Cell>Question Number</Cell>
          {plan.exerciseIds.map((exId, i) => <Cell key={i}>{i + 1}</Cell>)}
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
          {plan.questionsInfo.map(({ key, question }) => {
            const stat = stats.statsForQuestion(question);
            return <Cell key={key}>{stat.answer_stats.correct.selected_count} / {stat.answered_count}</Cell>;
          })}
        </Row>
      </StickyTable>

      <HomeworkQuestions
        questionsInfo={planInfo}
        questionType="teacher-review"
        controlsComponent={QuestionControls}
      />

    </Wrapper>
  );


});

Overview.title = 'Submission Overview';

Overview.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Overview;
