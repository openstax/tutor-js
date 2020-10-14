import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { ExercisePreview } from 'shared';
import TourAnchor from '../tours/anchor';


const ExercisePreviewWrapper = observer((props) => {
  const { exercise } = props;
  return (
    <TourAnchor id="exercise-preview">
      <ExercisePreview
        key={exercise.id}
        className="exercise-card"
        isInteractive={false}
        isVerticallyTruncated={true}
        isSelected={props.getExerciseIsSelected(exercise)}
        exercise={exercise.content}
        extractedInfo={exercise}
        questionType={props.questionType}
        onOverlayClick={props.onExerciseToggle}
        overlayActions={props.getExerciseActions(exercise)} />
    </TourAnchor>
  );
});

ExercisePreviewWrapper.displayName = 'ExercisePreviewWrapper';
ExercisePreviewWrapper.propTypes = {
  exercise:               PropTypes.object.isRequired,
  onShowDetailsViewClick: PropTypes.func.isRequired,
  onExerciseToggle:       PropTypes.func.isRequired,
  getExerciseIsSelected:  PropTypes.func.isRequired,
  getExerciseActions:     PropTypes.func.isRequired,
  questionType:           PropTypes.string,
};

export default ExercisePreviewWrapper;
