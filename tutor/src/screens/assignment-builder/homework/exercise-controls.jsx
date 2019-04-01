import {
  React, PropTypes, observer, inject, autobind,
} from '../../../helpers/react';
import { Button } from 'react-bootstrap';
import ScrollSpy from '../../../components/scroll-spy';
import Sectionizer from '../../../components/exercises/sectionizer';
import { Icon } from 'shared';
import fluxToMobx from '../../../helpers/flux-to-mobx';
import TourAnchor from '../../../components/tours/anchor';
import SelectionsTooltip from './selections-tooltip';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';

@inject('setSecondaryTopControls')
@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    planId:              PropTypes.string.isRequired,
    canAdd:              PropTypes.bool,
    canEdit:             PropTypes.bool,
    onCancel:            PropTypes.func,
    unDocked:            PropTypes.bool,
    canReview:           PropTypes.bool,
    addClicked:          PropTypes.func,
    reviewClicked:       PropTypes.func,
    sectionizerProps:    PropTypes.object,
    hideDisplayControls: PropTypes.bool,
    setSecondaryTopControls: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderControls);
    }
  }

  selectedCount = fluxToMobx(
    TaskPlanStore, () => TaskPlanStore.exerciseCount(this.props.planId) || 0,
  )

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

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
    if (this.props.canReview && this.selectedCount.current()) {
      return (
        [
          <Button
            key="next"
            variant="primary"
            className="review-exercises"
            onClick={this.props.reviewClicked}
          >
            Next
          </Button>,
          <Button
            key="cancel"
            variant="default"
            className="cancel-add"
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>,
        ]
      );
    } else if (this.props.canAdd) {
      return (
        <Button
          variant="default"
          className="add-sections"
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
        <Icon onClick={this.addTutorSelection} size="xs" className="hover-circle" type="chevron-up" />
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  renderDecreaseButton() {
    if (this.canChangeTutorQty() && TaskPlanStore.canDecreaseTutorExercises(this.props.planId)) {
      return (
        <Icon type="chevron-down" size="xs" onClick={this.removeTutorSelection} className="hover-circle" />
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  render() {
    if (this.props.unDocked) {
      return this.renderControls();
    }
    return null;
  }

  @autobind renderControls() {

    const numSelected = this.selectedCount.current();
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

export default ExerciseControls;
