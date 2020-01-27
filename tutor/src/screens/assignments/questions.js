import { React, PropTypes } from 'vendor';
import { AssignmentBuilder } from './builder';
import ChooseExercises from './homework/choose-exercises';
import sharedExercises from '../../models/exercises';

const Questions = ({ ux }) => {

  return (
    <AssignmentBuilder
      title="Select Questions"
      ux={ux}
    >
      <ChooseExercises
        ux={ux}
        exercises={sharedExercises}
        book={ux.referenceBook}
      />
    </AssignmentBuilder>
  );

};

Questions.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Questions;
