import PropTypes from 'prop-types';
import React from 'react';
import { invoke } from 'lodash';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import { partial, map } from 'underscore';
import { Col } from 'react-bootstrap';
import classnames from 'classnames';
import { ArbitraryHtmlAndMath } from 'shared';
import { BreadcrumbStatic } from '../../breadcrumb';
import { StepTitleStore } from '../../../flux/step-title';
import { TaskProgressStore } from '../../../flux/task-progress';
import { TaskPanelStore } from '../../../flux/task-panel';

class Milestone extends React.Component {

  static propTypes = {
    goToStep: PropTypes.func.isRequired,
    crumb: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    stepIndex: PropTypes.number,
  };

  render() {
    let preview;
    const { goToStep, crumb, currentStep, stepIndex } = this.props;

    const isCurrent = stepIndex === currentStep;

    const classes = classnames('milestone', `milestone-${crumb.type}`,
      { 'active': isCurrent });

    const previewText = StepTitleStore.getTitleForCrumb(crumb);
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
        >
          <BreadcrumbStatic
            crumb={crumb}
            data-label={crumb.label}
            currentStep={currentStep}
            goToStep={goToStepForCrumb}
            stepIndex={stepIndex}
            key={`breadcrumb-${crumb.type}-${stepIndex}`}
          />
          {preview}
        </div>
      </Col>
    );
  }
}

class Milestones extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    goToStep: PropTypes.func.isRequired,
  }


  goToStep = (...args) => {
    if (!this.props.goToStep(...Array.from(args || []))) {
      invoke(this.props, 'closeMilestones');
    }
  }

  render() {
    const crumbs = TaskPanelStore.get(this.props.id);
    const currentStep = TaskProgressStore.get(this.props.id);

    return (
      <div className="milestones-wrapper" role="dialog" tabIndex="-1">
        <div className="milestones task-breadcrumbs" role="document">
          {map(crumbs, (crumb, crumbIndex) =>
            <Milestone
              key={`crumb-wrapper-${crumbIndex}`}
              crumb={crumb}
              goToStep={this.goToStep}
              stepIndex={crumbIndex}
              currentStep={currentStep}
            />)}
        </div>
      </div>
    );
  }

}

export { Milestones, Milestone };
