import { React, PropTypes, observer, styled } from '../../helpers/react';
import Breadcrumb from '../../components/breadcrumb';
import UX from './ux';

// @observer
// class Breadcrumb extends React.Component {
//
//   static propTypes = {
//     ux: PropTypes.instanceOf(UX).isRequired,
//     step: PropTypes.object.isRequired,
//     stepIndex: PropTypes.number.isRequired,
//     isActive: PropTypes.bool.isRequired,
//     currentStep: PropTypes.number.isRequired,
//   };
//
//   render() {
//     const { step, ux, currentStep, stepIndex } = this.props;
// console.log(step.id, step.is_completed, step.is_correct)
//     return (
//       <SharedBreadcrumb
//         style={{ zIndex: stepIndex }}
//         crumb={step}
//         step={step}
//
//         data-label={step.label}
//         goToStep={ux.goToStep}
//         stepIndex={stepIndex}
//         currentStep={currentStep}
//       />
//     );
//   }
// }

const BreadcrumbsWrapper = styled.div`

`;

@observer
class Breadcrumbs extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <BreadcrumbsWrapper
        className="breadcrumbs-wrapper"
        role="dialog"
        tabIndex="-1"
      >

        {ux.steps.map( (step, stepIndex) =>
          <Breadcrumb
            key={`step-wrapper-${stepIndex}`}
            ux={ux}
            step={step}
            canReview={ux.task.isFeedbackAvailable}
            stepIndex={stepIndex}
            isCurrent={step === ux.currentStep}
            goToStep={ux.goToStep}
            currentStep={ux.currentStepIndex}
          />)}

      </BreadcrumbsWrapper>
    );
  }

}

export { Breadcrumbs, Breadcrumb };
