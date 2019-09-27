import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import Breadcrumb from '../../components/breadcrumb';
import UX from './ux';

const BreadcrumbsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
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

  // nothing is rendered directly, instead it's set in the secondaryToolbar
  render() {
    if (this.props.unDocked) {
      return this.renderBreadcrumbs();
    }
    return null;
  }

  @autobind renderBreadcrumbs() {

    const { ux } = this.props;
    let breadcrumbIndex = 0;

    return (
      <BreadcrumbsWrapper
        className="task-homework breadcrumbs-wrapper"
        role="dialog"
        tabIndex="-1"
      >
        {ux.steps.map( (step, stepIndex) =>
          <Breadcrumb
            key={`step-wrapper-${stepIndex}`}
            ux={ux}
            step={step}
            canReview={ux.task.isFeedbackAvailable}
            dataStepIndex={step.isInfo ? null : (breadcrumbIndex += 1)}
            stepIndex={stepIndex}
            isCurrent={step === ux.currentStep}
            goToStep={ux.goToStep}
          />)}

      </BreadcrumbsWrapper>
    );
  }

}

export { Breadcrumbs, Breadcrumb };
