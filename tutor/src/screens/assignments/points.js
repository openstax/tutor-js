import { React, PropTypes } from 'vendor';
import { AssignmentBuilder } from './builder';
import ReviewExercises from './homework/review-exercises';

const Review = ({ ux }) => {
  return (
    <AssignmentBuilder
      title="Set points and review"
      ux={ux}
    >
      <ReviewExercises ux={ux} />
    </AssignmentBuilder>
  );
};

Review.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Review;
