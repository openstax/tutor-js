import { React, PropTypes, observer, action, cn, styled, modelize } from 'vendor';
import { Col } from 'react-bootstrap';
import { ArbitraryHtmlAndMath, Icon } from 'shared';
import Breadcrumb from '../../components/breadcrumb';
import LatePointsInfo from '../../components/late-points-info';
import { colors } from 'theme';
import UX from './ux';
import { breakpoint } from 'theme';
import { DroppedStepIndicator } from '../../components/dropped-question'

const StyledCol = styled(Col)`
  .points-info-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px ${colors.neutral.pale} solid;
  }

  .points-info {
    background-color: ${colors.neutral.lighter};
    padding: 5px;

    table {
      margin: 0 auto;
    }
  }

  ${breakpoint.desktop`
    .points-info-container {
      opacity: 0;
    }
    &:hover .points-info-container {
      opacity: 1;
    }
  `}

  .ox-icon-clock {
    position: absolute;
    top: 1rem;
    left: 1rem;

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

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound goToStep() {
        this.props.goToStep(this.props.step);
    }

    render() {
        const { step, currentStep, stepIndex } = this.props;
        const active = stepIndex === currentStep;
        const classes = cn('milestone', `milestone-${step.type}`, { active });

        return (
            <StyledCol xs={6} sm={4} lg={2} data-step-index={stepIndex} className="milestone-wrapper">
                <div
                    tabIndex="0"
                    className={classes}
                    onClick={this.goToStep}
                >
                    {step.isLate && <Icon color={colors.danger} type='clock' />}
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
                    <DroppedStepIndicator step={step} size={4} />
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


    constructor(props) {
        super(props);
        modelize(this);
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
