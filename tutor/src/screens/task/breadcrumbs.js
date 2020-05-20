import { React, PropTypes, observer, styled, inject, autobind, css } from 'vendor';
import TutorLink from '../../components/link';
import Breadcrumb from '../../components/breadcrumb';
import TaskProgress from '../../components/task-progress';
import UX from './ux';
import { colors } from 'theme';
import { Icon } from 'shared';

const BreadcrumbsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  ${props => props.unDocked && css`
    background-color: ${colors.white};
    border-bottom: 1px solid ${colors.neutral.pale};
    padding: 25px 10px 10px;
  `}
`;

const StyledBackLink = styled.div`
  width: 100%;
  color: ${colors.link};
`;

const StyledHeadingTitle = styled.div`
  font-size: 1.7rem;
  padding: 15px 0;

  label:first-child {
    font-weight: bold;
    letter-spacing: 0.05rem;
  };
  label:nth-child(2) {
    padding: 0 10px;
    color: ${colors.neutral.pale};
  }
}
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
        <StyledBackLink>
          <TutorLink to="dashboard" params={{ courseId: ux.course.id }}>
            <Icon
              size="lg"
              type="angle-left"
              className="-move-exercise-up circle"
            />
          Dashboard
          </TutorLink>
        </StyledBackLink>
        <StyledHeadingTitle>
          <label>Homework One</label>
          <label> | </label>
          <label>Due Fr, May 01, 5:00 PM</label>
        </StyledHeadingTitle> 
        <TaskProgress ux={ux} />

      </BreadcrumbsWrapper>
    );
  }

}

export { Breadcrumbs, Breadcrumb };
