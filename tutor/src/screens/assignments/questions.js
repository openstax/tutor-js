import { React, PropTypes } from 'vendor';
import { AssignmentBuilder } from './builder';
import AssignmentUX from './ux';

const Questions = ({ ux }) => {

  return (
    <AssignmentBuilder
      title="Select Questions"
      ux={ux}
    >
    </AssignmentBuilder>
  );

};

Questions.propTypes = {
  ux: PropTypes.instanceOf(AssignmentUX).isRequired,
};

export default Questions;
