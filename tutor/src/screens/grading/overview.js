import { React, PropTypes, styled, observer } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';

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


const Overview = observer(({ ux: { plan } }) => {

  return (
    <Wrapper>
      <StickyTable>
        <Row>
          <Cell>Question Number</Cell>
          {plan.exerciseIds.map((exId, i) => <Cell key={i}>{i + 1}</Cell>)}
        </Row>
        <Row>
          <Cell>Question Type</Cell>
          {plan.exercises.map((ex) => <Cell key={ex.id}><ExerciseType exercise={ex} /></Cell>)}
        </Row>
        <Row>
          <Cell>Available Points</Cell>
          {plan.exerciseIds.map((exId, i) => <Cell key={i}>{i + 1}</Cell>)}
        </Row>
        <Row>
          <Cell>Correct Responses</Cell>
          {plan.exerciseIds.map((exId, i) => <Cell key={i}>{i + 1}</Cell>)}
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
