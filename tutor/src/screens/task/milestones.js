import { React, PropTypes, observer, action, cn, styled } from 'vendor';
import { Col } from 'react-bootstrap';
import { ArbitraryHtmlAndMath, Icon } from 'shared';
import Breadcrumb from '../../components/breadcrumb';
import LatePointsInfo from '../../components/late-points-info';
import { colors } from 'theme';
import UX from './ux';

const StyledCol = styled(Col)`
  .points-info-container {
    width: 100%;
    position: absolute;
    bottom: -40px;
    left: 50%;
    opacity: 0;
    border-top: 1px ${colors.neutral.pale} solid;
    transition: 0s ease;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }

  .points-info {
    background-color: ${colors.neutral.lighter};
    padding: 5px;
    
    table {
      margin: 0 auto;
    }
  }

  &:hover .points-info-container {
    opacity: 1;
  }

  .icon {
    position: absolute;
    top: 3px;
    right: 3px;

    & svg {
      height: 12px;
    }
  }
`;


@observer
class Milestone extends React.Component {

  static propTypes = {
    goToStep: PropTypes.func.isRequired,
    step: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    stepIndex: PropTypes.number,
  };

  @action.bound goToStep() {
    this.props.goToStep(this.props.step);
  }

  render() {
    const { step, currentStep, stepIndex } = this.props;
    const active = stepIndex === currentStep;
    const classes = cn('milestone', `milestone-${step.type}`, { active });

    return (
      <StyledCol xs={3} lg={2} data-step-index={stepIndex} className="milestone-wrapper">
        <div
          tabIndex="0"
          className={classes}
          onClick={this.goToStep}
        >
          <Breadcrumb
            canReview
            step={step}
            isCurrent={active}
            stepIndex={stepIndex}
            data-label={step.label}
            goToStep={this.goToStep}
            currentStep={currentStep}
            key={`breadstep-${step.type}-${stepIndex}`}
          />
          <ArbitraryHtmlAndMath
            block={true}
            className="milestone-preview"
            html={step.preview}
          />
          <div className="icon">
            {step.isLate && 
            <Icon
              color={colors.danger}
              type='clock'
            />}
          </div>
          {
            step.isExercise && step.is_completed && (
              <div className="points-info-container">
                <div className="points-info"><LatePointsInfo step={step} /></div>
              </div>
            )
          }
        </div>
      </StyledCol>
    );
  }
}

@observer
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
