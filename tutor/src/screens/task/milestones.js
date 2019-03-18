import { React, PropTypes, observer, action, cn } from '../../helpers/react';
import { invoke } from 'lodash';
// import createReactClass from 'create-react-class';
// import ReactDOM from 'react-dom';
import { partial, map } from 'underscore';
import { Col } from 'react-bootstrap';
import classnames from 'classnames';
import { ArbitraryHtmlAndMath } from 'shared';
import { BreadcrumbStatic } from '../../components/breadcrumb';
// import { StepTitleStore } from '../../../flux/step-title';
// import { TaskProgressStore } from '../../../flux/task-progress';
// import { TaskPanelStore } from '../../../flux/task-panel';
import UX from './ux';

@observer
class Milestone extends React.Component {

  static propTypes = {
    //ux: PropTypes.instanceOf(UX).isRequired,
    goToStep: PropTypes.func.isRequired,
    step: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    stepIndex: PropTypes.number,
  };

  @action.bound goToStep() {
    this.props.goToStep(
      this.props.step, this.props.stepIndex
    );
  }

  render() {
    const { step, currentStep, stepIndex } = this.props;

    const classes = cn('milestone', `milestone-${step.type}`, {
      'active': stepIndex === currentStep,
    });

    const preview = (step.type === 'exercise') ?
      <ArbitraryHtmlAndMath block={true}
        className="milestone-preview"
        html={step.preview}
      /> : <div className="milestone-preview">{step.preview}</div>;

    return (
      <Col xs={3} lg={2} className="milestone-wrapper">
        <div
          tabIndex="0"
          className={classes}
          aria-label={preview}
          onClick={this.goToStep}
        >
          <BreadcrumbStatic
            crumb={step}
            data-label={step.label}
            currentStep={currentStep}
            goToStep={this.goToStep}
            stepIndex={stepIndex}
            key={`breadstep-${step.type}-${stepIndex}`}
          />
          {preview}
        </div>
      </Col>
    );
  }
}

class Milestones extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    goToStep: PropTypes.func.isRequired,
  }


  @action.bound goToStep(step) {
    this.props.goToStep(step);
  }

  render() {
    const { ux } = this.props;

    return (
      <div className="milestones-wrapper" role="dialog" tabIndex="-1">
        <div className="milestones task-breadsteps" role="document">
          {ux.steps.map( (step, stepIndex) =>
            <Milestone
              key={`step-wrapper-${stepIndex}`}
              step={step}
              goToStep={this.goToStep}
              stepIndex={stepIndex}
              currentStep={ux.stepIndex}
            />)}
        </div>
      </div>
    );
  }

}

export { Milestones, Milestone };
