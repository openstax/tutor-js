import { React, PropTypes, observer, action, cn } from '../../helpers/react';
import { Col } from 'react-bootstrap';
import { ArbitraryHtmlAndMath } from 'shared';
import Breadcrumb from '../../components/breadcrumb';
import UX from './ux';

@observer
class Milestone extends React.Component {

  static propTypes = {
    goToStep: PropTypes.func.isRequired,
    step: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    stepIndex: PropTypes.number,
  };

  @action.bound goToStep() {
    this.props.goToStep(
      this.props.stepIndex, this.props.step
    );
  }

  render() {
    const { step, currentStep, stepIndex } = this.props;
    const active = stepIndex === currentStep;
    const classes = cn('milestone', `milestone-${step.type}`, { active });

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
          <Breadcrumb
            step={step}
            stepIndex={stepIndex}
            data-label={step.label}
            goToStep={this.goToStep}
            currentStep={currentStep}
            isCurrent={active}
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
    onHide: PropTypes.func.isRequired,
  }


  @action.bound goToStep(index) {
    this.props.ux.goToStep(index);
    this.props.onHide();
  }

  render() {
    const { ux } = this.props;

    return (
      <div className="milestones-wrapper" role="dialog" tabIndex="-1">
        <div className="milestones task-breadsteps" role="document">
          {ux.milestoneSteps.map( (step, stepIndex) =>
            <Milestone
              key={`step-wrapper-${stepIndex}`}
              step={step}
              goToStep={this.goToStep}
              stepIndex={stepIndex}
              currentStep={ux.currentStepIndex}
            />)}
        </div>
      </div>
    );
  }

}

export { Milestones, Milestone };
