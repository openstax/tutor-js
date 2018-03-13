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
        onOverlayClick={props.onExerciseToggle}
        overlayActions={props.getExerciseActions(exercise)} />
    </TourAnchor>
  );
});

ExercisePreviewWrapper.propTypes = {
  exercise:               React.PropTypes.object.isRequired,
  onShowDetailsViewClick: React.PropTypes.func.isRequired,
  onExerciseToggle:       React.PropTypes.func.isRequired,
  getExerciseIsSelected:  React.PropTypes.func.isRequired,
  getExerciseActions:     React.PropTypes.func.isRequired,
};

export default ExercisePreviewWrapper;
