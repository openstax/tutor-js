import { React, PropTypes, observer, styled } from 'vendor';
import { AssignmentBuilder } from './builder';
import ChooseExercises from './homework/choose-exercises';
import { colors } from '../../theme';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Item = styled.div`
  display: flex;
  padding: 1rem 2.5rem;

  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
`;

const Value = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-left: 1rem;
`;

const Indicator = ({ title, value, testId }) => {
  return (
    <Item>
      <span>{title}</span>
      <Value data-test-id={testId}>{value}</Value>
    </Item>
  );
};

Indicator.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  testId: PropTypes.string,
};

const Indicators = observer(({ ux }) => {
  return (
    <Wrapper>
      <Indicator
        title="My selections"
        value={ux.numExerciseSteps}
        testId="selection-count-footer"
      />
      <Indicator
        title="Personalized questions"
        value={ux.numTutorSelections}
        testId="tutor-count-footer"
      />
      <Indicator
        title="Total"
        value={ux.totalSelections}
        testId="total-count-footer"
      />
    </Wrapper>
  );
});

const Questions = observer(({ ux }) => {

  return (
    <AssignmentBuilder
      title="Select Questions"
      ux={ux}
      middleControls={<Indicators ux={ux} />}
    >
      <ChooseExercises ux={ux} />
    </AssignmentBuilder>
  );

});

Questions.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Questions;
