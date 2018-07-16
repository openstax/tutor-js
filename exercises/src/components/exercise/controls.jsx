import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import Exercises, { ExercisesMap } from '../../models/exercises';
import { Button, ButtonToolbar } from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button.cjsx';
import MPQToggle from 'components/exercise/mpq-toggle';
import { SuretyGuard, idType } from 'shared';

@withRouter
@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        uid: idType,
      }),
    }),
    history: React.PropTypes.shape({
      push: React.PropTypes.func,
    }).isRequired,
    exercises: React.PropTypes.instanceOf(ExercisesMap),
  };

  static defaultProps = {
    exercises: Exercises,
  }

  @computed get exercise() {
    return this.props.exercises.get(this.props.match.params.uid);
  }

  @action.bound saveExerciseDraft() {
    const { exercise } = this;
    this.props.exercises.saveDraft(exercise).then(() => {
      this.props.history.push(`/exercise/${exercise.uid}`);
    });
  }

  @action.bound publishExercise() {
    const { exercise } = this;
    this.props.exercises.publish(exercise).then(() => {
      this.props.history.push(`/exercise/new`);
    });
  }

  render() {
    const { exercise } = this;
    if (!exercise) { return null; }

    const guardProps = {
      onlyPromptIf: this.isExerciseDirty,
      placement: 'right',
      message: "You will lose all unsaved changes"
    };

    return (
      <li className="exercise-navbar-controls">

        <ButtonToolbar className="navbar-btn">
          <AsyncButton
            bsStyle="info"
            className="draft"
            onClick={this.saveExerciseDraft}
            disabled={!exercise.validity.valid}
            isWaiting={exercise.api.isPending}
            waitingText="Saving..."
          >
            Save Draft
          </AsyncButton>
          {!exercise.isNew &&
            <SuretyGuard
              onConfirm={this.publishExercise}
              okButtonLabel="Publish"
              placement="right"
              message="Once an exercise is published, it is available for use.">
              <AsyncButton
                bsStyle="primary"
                className="publish"
                disabled={!exercise.isPublishable}
                isWaiting={exercise.api.isPending}
                waitingText="Publishing..."
              >
                Publish
              </AsyncButton>
            </SuretyGuard>}
          <Link to={`/preview/${exercise.uid}`} className="btn btn-info">
            Preview Only
          </Link>
        </ButtonToolbar>
        <div className="right-side">
          <MPQToggle exercise={exercise} />
        </div>
          </li>
    );
  }
}

export default ExerciseControls;
