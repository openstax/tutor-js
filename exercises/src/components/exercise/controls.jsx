import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import Exercises from '../../models/exercises';
import { Button, ButtonToolbar } from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button.cjsx';
import MPQToggle from 'components/exercise/mpq-toggle';
import { SuretyGuard } from 'shared';

import Location from 'stores/location';

@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    // params: {
    //   id:   React.PropTypes.string,
    // },
  };

  @computed get exercise() {
    return Exercises.get(this.props.match.params.id);
  }

  update = () => { return this.forceUpdate(); };

  // isExerciseDirty = () => {
  //   return (
  //       this.props.id && ExerciseStore.isChanged(this.props.id)
  //   );
  // };

  @action.bound saveExerciseDraft() {
    this.exercise.saveDraft();
  }

  // publishExercise = () => {
  //   return (
  //       ExerciseActions.publish(this.props.id)
  //   );
  // };

  // onPreview = () => {
  //   return (
  //       this.props.location.visitPreview(this.props.id)
  //   );
  // };

  render() {
    const { exercise } = this;

    if (!exercise) { return null; }

    const guardProps = {
      onlyPromptIf: this.isExerciseDirty,
      placement: 'right',
      message: "You will lose all unsaved changes"
    };

    return (
      <div className="exercise-navbar-controls">
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
          <Button bsStyle="info" onClick={this.onPreview}>
            Preview Only
          </Button>
        </ButtonToolbar>
        <div className="right-side">
          <MPQToggle exercise={exercise} />
        </div>
      </div>
    );
  }
}

export default ExerciseControls;
