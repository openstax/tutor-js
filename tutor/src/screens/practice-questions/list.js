import { React, styled } from 'vendor';
import { colors } from 'theme';
import { ExercisePreview } from 'shared';
import Exercises from '../../models/exercises';

const PracticeQuestionsList = ({ ux }) => {
//   const sharedProps = {
//     exercises,
//     course: this.props.course,
//     book: this.props.course.referenceBook,
//     pageIds: this.props.pageIds,
//     onExerciseToggle: this.onExerciseToggle,
//     getExerciseActions: this.getExerciseActions,
//     getExerciseIsSelected: this.getExerciseIsSelected,
//     topScrollOffset: 100,
//   };
  // const exercises = Exercises.array.map(ex => ex.content);
  //Exercises.fetch({ course: ux.course, exercise_ids: [528] });
  console.log(Exercises);
  if(Exercises.isEmpty) return <div>dddd</div>;
  //console.log(exercises);
  return (
    <ExercisePreview
      key={1}
      className="exercise-card"
      isInteractive={false}
      isVerticallyTruncated={true}
      isSelected={false}
      exercise={Exercises.array[0].content}
      extractedInfo={Exercises.array[0]}
      onOverlayClick={undefined}
      overlayActions={undefined} />
    // <div>list</div>
  );
};

export default PracticeQuestionsList;