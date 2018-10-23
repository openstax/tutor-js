import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import { partial, map } from 'underscore';
import { Col } from 'react-bootstrap';
import classnames from 'classnames';
import { ChapterSectionMixin, ArbitraryHtmlAndMath } from 'shared';
import { BreadcrumbStatic } from '../../breadcrumb';
import { StepTitleStore } from '../../../flux/step-title';
import { TaskProgressStore } from '../../../flux/task-progress';
import { TaskPanelStore } from '../../../flux/task-panel';

class Milestone extends React.Component {
  static displayName = 'Milestone';

  static propTypes = {
    goToStep: PropTypes.func.isRequired,
    crumb: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    stepIndex: PropTypes.number,
  };

  handleKeyUp = (crumbKey, keyEvent) => {
    if ((keyEvent.keyCode === 13) || (keyEvent.keyCode === 32)) {
      this.props.goToStep(crumbKey);
      keyEvent.preventDefault();
    }
  };

  render() {
    let preview;
    const { goToStep, crumb, currentStep, stepIndex } = this.props;

    const isCurrent = stepIndex === currentStep;

    const classes = classnames('milestone', `milestone-${crumb.type}`,
      { 'active': isCurrent });

    const previewText = StepTitleStore.getTitleForCrumb(this.props.crumb);

    if (crumb.type === 'exercise') {
      preview = <ArbitraryHtmlAndMath block={true} className="milestone-preview" html={previewText} />;
    } else {
      preview = <div className="milestone-preview">
        {previewText}
      </div>;
    }

    const goToStepForCrumb = partial(goToStep, stepIndex);

    return (
      <Col xs={3} lg={2} className="milestone-wrapper">
        <div
          tabIndex="0"
          className={classes}
          aria-label={previewText}
          onClick={goToStepForCrumb}
          onKeyUp={partial(this.handleKeyUp, stepIndex)}>
          <BreadcrumbStatic
            crumb={crumb}
            data-label={crumb.label}
            currentStep={currentStep}
            goToStep={goToStepForCrumb}
            stepIndex={stepIndex}
            key={`breadcrumb-${crumb.type}-${stepIndex}`}
            ref={`breadcrumb-${crumb.type}-${stepIndex}`} />
          {preview}
        </div>
      </Col>
    );
  }
}

const Milestones = createReactClass({
  displayName: 'Milestones',
  mixins: [ChapterSectionMixin],

  propTypes: {
    id: PropTypes.string.isRequired,
    goToStep: PropTypes.func.isRequired,
  },

  getInitialState() {
    const currentStep = TaskProgressStore.get(this.props.id);
    const crumbs = TaskPanelStore.get(this.props.id);

    return {
      currentStep,
      crumbs,
    };
  },

  UNSAFE_componentWillMount() {
    const bStyle = document.body.style;
    this._bodyOverflowStyle = bStyle.overflow;
    return bStyle.overflow = 'hidden';
  },

  componentDidMount() {
    this.switchCheckingClick();
    return this.switchTransitionListen();
  },

  componentWillUnmount() {
    this.switchCheckingClick(false);
    this.switchTransitionListen(false);
    const bStyle = document.body.style;
    return bStyle.overflow = this._bodyOverflowStyle;
  },

  componentDidEnter(transitionEvent) {
    if (transitionEvent.propertyName === 'transform') {
      typeof this.props.handleTransitions === 'function' && this.props.handleTransitions(transitionEvent);
    }
  },

  switchTransitionListen(switchOn = true) {
    const eventAction = switchOn ? 'addEventListener' : 'removeEventListener';

    const milestones = ReactDOM.findDOMNode(this);
    milestones[eventAction]('transitionend', this.componentDidEnter);
    return milestones[eventAction]('webkitTransitionEnd', this.componentDidEnter);
  },

  switchCheckingClick(switchOn = true) {
    const eventAction = switchOn ? 'addEventListener' : 'removeEventListener';

    document[eventAction]('click', this.checkAllowed, true);
    return document[eventAction]('focus', this.checkAllowed, true);
  },

  checkAllowed(focusEvent) {
    const modal = ReactDOM.findDOMNode(this);

    if (!modal.contains(focusEvent.target) && !(typeof this.props.filterClick === 'function' ? this.props.filterClick(focusEvent) : undefined)) {
      focusEvent.preventDefault();
      focusEvent.stopImmediatePropagation();
      return modal.focus();
    }
  },

  goToStep(...args) {
    if (!this.props.goToStep(...Array.from(args || []))) {
      return this.props.closeMilestones();
    }
  },

  render() {
    const { crumbs, currentStep } = this.state;

    const stepButtons = map(crumbs, (crumb, crumbIndex) => {
      return (
        <Milestone
          key={`crumb-wrapper-${crumbIndex}`}
          crumb={crumb}
          goToStep={this.goToStep}
          stepIndex={crumbIndex}
          currentStep={currentStep} />
      );
    });

    const classes = 'task-breadcrumbs';

    return (
      <div className="milestones-wrapper" role="dialog" tabIndex="-1">
        <div className="milestones task-breadcrumbs" role="document">
          {stepButtons}
        </div>
      </div>
    );
  },
});

export { Milestones, Milestone };
