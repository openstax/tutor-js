import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import Exercises, { ExercisesMap } from '../models/exercises';
import { idType } from 'shared';
import { Loading, NotFound } from './exercise-state';
import Controls from './preview/controls';
import { ExercisePreview } from 'shared';

@observer
export default
class Preview extends React.Component {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        uid: idType,
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    exercises: PropTypes.instanceOf(ExercisesMap),
  };

  static defaultProps = {
    exercises: Exercises,
  }

  static Controls = Controls;

  UNSAFE_componentWillMount() {
    const { uid } = this.props.match.params;
    this.props.exercises.ensureLoaded(uid);
  }

  @computed get exercise() {
    return this.props.exercises.get(this.props.match.params.uid);
  }

  render() {
    if (this.props.exercises.api.isPending) { return <Loading />; }
    const { exercise } = this;
    if (!exercise) { return <NotFound />; }

    return (
      <div className="preview-screen">
        <ExercisePreview
          displayAllTags
          displayFeedback
          exercise={exercise}
        >
          <Link className="btn" to={`/exercise/${exercise.uid}`}>EDIT</Link>
        </ExercisePreview>
      </div>
    );
  }
}
