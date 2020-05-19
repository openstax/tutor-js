import { React, PropTypes, observer, styled, inject, autobind, css } from 'vendor';
import Breadcrumb from '../../components/breadcrumb';
import TaskProgress from '../../components/task-progress';
import UX from './ux';
import { colors } from 'theme';

const BreadcrumbsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  ${props => props.unDocked && css`
    background-color: ${colors.white};
    border-bottom: 1px solid ${colors.neutral.pale};
    padding: 10px;

  `}
`;

@inject('setSecondaryTopControls')
@observer
class Breadcrumbs extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    setSecondaryTopControls: PropTypes.func.isRequired,
    unDocked: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderBreadcrumbs);
    }
  }

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

  // if it is undocked from the navbar, show under the navbar
  render() {
    if (this.props.unDocked) {
      return this.renderBreadcrumbs();
    }
    return null;
  }

  @autobind renderBreadcrumbs() {

    const { ux, unDocked } = this.props;
    let breadcrumbIndex = 0;

    return (
      <BreadcrumbsWrapper
        className="task-homework breadcrumbs-wrapper"
        role="dialog"
        tabIndex="-1"
        unDocked={unDocked}
      >
        {/* {ux.steps.map( (step, stepIndex) =>
          <Breadcrumb
            key={`step-wrapper-${stepIndex}`}
            ux={ux}
            step={step}
            canReview={ux.task.isFeedbackAvailable}
            dataStepIndex={step.isInfo ? null : (breadcrumbIndex += 1)}
            stepIndex={stepIndex}
            isCurrent={step === ux.currentStep}
            goToStep={ux.goToStep}
          />)} */}
        <TaskProgress ux={ux} />

      </BreadcrumbsWrapper>
    );
  }

}

export { Breadcrumbs, Breadcrumb };
