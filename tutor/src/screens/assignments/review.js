import { React, PropTypes } from 'vendor';
import { AssignmentBuilder } from './builder';
import AssignmentUX from './ux';

const PointsNReview = ({ ux }) => {
  return (
    <AssignmentBuilder
      title="Set points and review"
      ux={ux}
    >
    </AssignmentBuilder>
  );
};

PointsNReview.propTypes = {
  ux: PropTypes.instanceOf(AssignmentUX).isRequired,
};

export default PointsNReview;
