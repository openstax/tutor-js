import { React, PropTypes } from 'vendor';
import { AssignmentBuilder } from './builder';
import AssignmentUX from './ux';

const Chapters = ({ ux }) => {

  return (
    <AssignmentBuilder
      title="Add Chapters"
      ux={ux}
    >
    </AssignmentBuilder>
  );

};

Chapters.propTypes = {
  ux: PropTypes.instanceOf(AssignmentUX).isRequired,
};

export default Chapters;
