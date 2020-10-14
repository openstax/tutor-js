import { React, PropTypes } from 'vendor';
import Course from '../../models/course';
import ExerciseCards from '../../components/exercises/cards';
import TourRegion from '../../components/tours/region';

const ExerciseCardsWrapper = props => (
  <TourRegion
    id="question-library-exercises"
    otherTours={['preview-question-library-exercises']}
    course={props.course.id}
  >
    <ExerciseCards {...props} />
  </TourRegion>
);
ExerciseCardsWrapper.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
};

const PracticeQuestionsList = ({ ux }) => {
  const sharedProps = {
    exercises: ux.exercises,
    course: ux.course,
    book: ux.course.referenceBook,
    pageIds: ux.exercises.uniqPageIds,
    onExerciseToggle: () => console.log(1),
    getExerciseActions: () => console.log(1),
    getExerciseIsSelected: () => console.log(1),
    topScrollOffset: 100,
  };
  return (
    <ExerciseCardsWrapper
      {...sharedProps}
      watchEvent="change-exercise-"
      focusedExercise={undefined}
      onShowDetailsViewClick={undefined} />
  );
};

export default PracticeQuestionsList;