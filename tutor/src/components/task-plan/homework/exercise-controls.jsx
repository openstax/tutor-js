import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import ScrollSpy from '../../scroll-spy';
import Sectionizer from '../../exercises/sectionizer';
import Icon from '../../icon';

import TourAnchor from '../../tours/anchor';
import SelectionsTooltip from './selections-tooltip';

import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';

@observer
export default class ExerciseControls extends React.Component {
  static propTypes = {
    planId:              React.PropTypes.string.isRequired,
    onCancel:            React.PropTypes.func.isRequired,
    canAdd:              React.PropTypes.bool,
    canEdit:             React.PropTypes.bool,
    canReview:           React.PropTypes.bool,
    addClicked:          React.PropTypes.func,
    reviewClicked:       React.PropTypes.func,
    sectionizerProps:    React.PropTypes.object,
    hideDisplayControls: React.PropTypes.bool,
  };

  addTutorSelection = () => {
    TaskPlanActions.updateTutorSelection(this.props.planId, 1);
  };

  removeTutorSelection = () => {
    TaskPlanActions.updateTutorSelection(this.props.planId, -1);
  };

  renderDisplayControls() {
    if (this.props.hideDisplayControls) {
      return <div className="controls" />;
    } else {
      return (
        <div className="controls">
          <ScrollSpy dataSelector="data-section">
            <Sectionizer
              ref="sectionizer"
              {...this.props.sectionizerProps}
              nonAvailableWidth={1000}
              onScreenElements={[]} />
          </ScrollSpy>
        </div>
      );
    }
  }

  renderExplanation() {
    if (this.props.canAdd) { return null; }
    return (
      <div className="tutor-added-later">
        <span>
          Tutor selections are added later to support spaced practice and personalized learning.
        </span>
      </div>
    );
  }

  renderActionButtons() {
    if (this.props.canReview && TaskPlanStore.exerciseCount(this.props.planId)) {
      return (
        [
          <Button
            key="next"
            bsStyle="primary"
            className="-review-exercises"
            onClick={this.props.reviewClicked}
          >
            Next
          </Button>,
          <Button
            key="cancel"
            bsStyle="default"
            className="-cancel-add"
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>,
        ]
      );
    } else if (this.props.canAdd) {
      return (
        <Button
          bsStyle="default"
          className="-add-exercises"
          onClick={this.props.addClicked}
        >
          + Add More Sections
        </Button>
      );
    } else {
      return null;
    }
  }

  canChangeTutorQty() {
    return Boolean(this.props.canEdit || this.props.canAdd);
  }

  renderIncreaseButton() {
    if (this.canChangeTutorQty() && TaskPlanStore.canIncreaseTutorExercises(this.props.planId)) {
      return (
        <Button onClick={this.addTutorSelection} className="btn-xs hover-circle">
          <Icon type="chevron-up" />
        </Button>
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  renderDecreaseButton() {
    if (this.canChangeTutorQty() && TaskPlanStore.canDecreaseTutorExercises(this.props.planId)) {
      return (
        <Button onClick={this.removeTutorSelection} className="btn-xs hover-circle">
          <Icon type="chevron-down" />
        </Button>
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  render() {
    const numSelected = TaskPlanStore.exerciseCount(this.props.planId);
    const numTutor = TaskPlanStore.getTutorSelections(this.props.planId);

    return (
      <div className="exercise-controls-bar">
        {this.renderDisplayControls()}
        <div className="indicators">
          <div className="num total">
            <h2>
              {numSelected + numTutor}
            </h2>
            <span>
              Total Problems
            </span>
          </div>
          <div className="num mine">
            <h2>
              {numSelected}
            </h2>
            <span>
              My Selections
            </span>
          </div>
          <TourAnchor id="tutor-selections" className="num tutor">
            <div className="tutor-selections">
              {this.renderDecreaseButton()}
              <h2>
                {numTutor}
              </h2>
              {this.renderIncreaseButton()}
            </div>
            <span>
              OpenStax Tutor Selections
            </span>
            <SelectionsTooltip />
          </TourAnchor>
          {this.renderExplanation()}
        </div>
        <div className="actions">
          {this.renderActionButtons()}
        </div>
      </div>
    );
  }
}
