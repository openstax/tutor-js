import { React, PropTypes, styled, observer } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import S from '../../helpers/string';

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


const Overview = observer(({ ux: { plan, stats } }) => {
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

    </Wrapper>
  );


});

Overview.title = 'Submission Overview';

Overview.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Overview;
