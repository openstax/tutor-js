import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { autobind } from 'core-decorators';
import ExerciseCard from './exercise-card';
import Loading from 'shared/components/loading-animation';
import UX from './ux';

export default
@observer
class Exercises extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  @autobind renderExercise(exercise) {
    return (
      <ExerciseCard key={exercise.id} exercise={exercise} ux={this.props.ux} />
    );
  }

  render() {
    const { ux } = this.props;
    if (ux.isFetchingExercises) {
      return <Loading message="Fetching Exercises…" />;
    }

    if (isEmpty(ux.exercises)) { return <h1>No exercises found</h1>; }

    return (
      <div className="exercises">
        {ux.exercises.map(this.renderExercise)}
      </div>
    );
  }
}
