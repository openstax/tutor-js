import { React, PropTypes, observer, styled, inject, autobind, css } from 'vendor';
import TutorLink from '../../components/link';
import TaskProgress from '../../components/task-progress';
import UX from './ux';
import { colors } from 'theme';
import { Icon } from 'shared';
import TimeHelper from 'helpers/time';

const ExercisesTaskHeaderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  ${props => props.unDocked && css`
    background-color: ${colors.white};
    border-bottom: 1px solid ${colors.neutral.pale};
    padding: 25px 32px 16px;
  `}

  ${props => !props.unDocked && css`
    border-bottom: 1px solid ${colors.neutral.pale};
    padding: 20px 10px 10px;
  `}
`;

const StyledBackLink = styled.div`
  width: 100%;
  color: ${colors.link};
`;

const StyledHeadingTitle = styled.div`
  display: flex;
  font-size: 1.7rem;
  padding: 15px 0;
  width: 100%;

  div + div {
    margin-left: 10px;
  }

  div:first-child {
    font-weight: bold;
    letter-spacing: 0.05rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  };
  div:nth-child(2) {
    padding: 0 0.8rem;
    color: ${colors.neutral.pale};
  }
  
  /* Hide the date when screen is screen is tablet size or smaller */
  ${({ theme }) => theme.breakpoint.tablet`
    div:nth-child(2) {
      display: none;
    }
    div:last-child {
      display: none;
    }
  `}
`;

@inject('setSecondaryTopControls')
@observer
class ExercisesTaskHeader extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    setSecondaryTopControls: PropTypes.func.isRequired,
    unDocked: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderExerciseHeader);
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
      return this.renderExerciseHeader();
    }
    return null;
  }

  @autobind renderExerciseHeader() {

    const { ux, unDocked } = this.props;
    return (
      <ExercisesTaskHeaderWrapper
        className="task-homework breadcrumbs-wrapper"
        role="dialog"
        tabIndex="-1"
        unDocked={unDocked}
      >
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
          <div><span>{ux.task.title}</span></div>
          <div><span>|</span></div>
          <div><span>Due {TimeHelper.toShortHumanDateTimeTz(ux.task.dueAtMoment)}</span></div>
        </StyledHeadingTitle>
        <TaskProgress steps={ux.steps} goToStep={ux.goToStepId} currentStep={ux.currentStep} />
      </ExercisesTaskHeaderWrapper>
    );
  }

}

export default ExercisesTaskHeader;
