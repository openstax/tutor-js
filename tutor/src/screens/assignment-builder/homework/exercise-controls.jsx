import {
  React, PropTypes, observer, inject, autobind, computed,
} from 'vendor';
import { Button } from 'react-bootstrap';
import ScrollSpy from '../../../components/scroll-spy';
import Sectionizer from '../../../components/exercises/sectionizer';
import { Icon } from 'shared';
import TourAnchor from '../../../components/tours/anchor';
import SelectionsTooltip from './selections-tooltip';
import UX from '../ux';

@inject('setSecondaryTopControls')
@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    unDocked:            PropTypes.bool,
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

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

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

  @computed get canAdd() {
    return this.props.ux.plan.canEdit;
  }

  renderExplanation() {
    if (this.canAdd) { return null; }
    return (
      <div className="tutor-added-later">
        <span>
          Tutor selections are added later to support spaced practice and personalized learning.
        </span>
      </div>
    );
  }

  renderActionButtons() {
    const { ux } = this.props;
    if (ux.plan.numExercises) {
      return (
        [
          <Button
            key="next"
            variant="primary"
            className="review-exercises"
            onClick={ux.onExercisesReviewClicked}
          >
            Next
          </Button>,
          <Button
            key="cancel"
            variant="default"
            className="cancel-add"
            onClick={ux.onSectExercisesCancel}
          >
            Cancel
          </Button>,
        ]
      );
    } else if (ux.canEdit) {
      return (
        <Button
          variant="default"
          className="add-sections"
          onClick={ux.onShowSectionSelection}
        >
          + Add More Sections
        </Button>
      );
    } else {
      return null;
    }
  }

  renderIncreaseButton() {
    const { ux } = this.props;
    if (ux.canEdit && ux.plan.canIncreaseTutorExercises) {
      return (
        <Icon
          type="chevron-up" onClick={ux.increaseTutorSelection}
          className="hover-circle" size="xs" />
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  renderDecreaseButton() {
    const { ux } = this.props;
    if (ux.canEdit && ux.plan.canDecreaseTutorExercises) {
      return (
        <Icon
          type="chevron-down" onClick={ux.decreaseTutorSelection}
          className="hover-circle" size="xs" />
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
    const { ux: { plan } } = this.props;

    return (
      <div className="assignment exercise-controls-bar">
        {this.renderDisplayControls()}
        <div className="indicators">
          <div className="num total">
            <h2>
              {plan.numExercises + plan.numTutorSelections}
            </h2>
            <span>
              Total Problems
            </span>
          </div>
          <div className="num mine">
            <h2>
              {plan.numExercises}
            </h2>
            <span>
              My Selections
            </span>
          </div>
          <TourAnchor id="tutor-selections" className="num tutor">
            <div className="tutor-selections">
              {this.renderDecreaseButton()}
              <h2>
                {plan.numTutorSelections}
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
