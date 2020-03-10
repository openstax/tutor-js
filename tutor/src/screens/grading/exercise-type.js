import { React, PropTypes } from 'vendor';

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


export default ExerciseType;
