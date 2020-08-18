import { React, PropTypes, observer, styled, inject, autobind, css, cn } from 'vendor';
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
  padding: 25px 0 10px;
  ${props => props.unDocked && css`
    background-color: ${colors.white};
    border-bottom: 1px solid ${colors.neutral.pale};
    > div {
      margin-bottom: 10px;
    }
  `}

  ${props => !props.unDocked && css`
    border-bottom: 1px solid ${colors.neutral.pale};
    > div {
      margin-bottom: 10px;
    }
  `}

  .sticky-table {
    margin-left: 15px;
    margin-right: 15px;

    ${({ theme }) => theme.breakpoint.only.mobile`
      margin-left: 0;
      margin-right: 0;
    `};
  }
`;

const StyledBackLink = styled.div`
  width: 100%;
  color: ${colors.link};
  padding-left: 10px;
  ${({ theme }) => theme.breakpoint.mobile`
    padding: 0 5px;
  `};
`;

const StyledHeadingTitle = styled.div`
  display: flex;
  font-size: 1.7rem;
  line-height: none;
  padding-left: 10px;
  width: 100%;

  .title-info {
    padding: 6px;
    display: flex;

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

    .title-divider {
      padding: 0 0.8rem;
      color: ${colors.neutral.pale};
    }
  }
  
  .overview-task-icon {
      display: none;
    }
  
  /*
    Hide the date when screen is tablet size or smaller.
    Show overview icon.
  */
  ${({ theme }) => theme.breakpoint.tablet`
    justify-content: space-between;
    padding: 0 10px;
    .title-info {
      .title-divider, .title-due-date {
        display: none;
      }
    }
    .overview-task-icon {
      display: inherit;
      margin-right: 5px;

      .isShowingTable {
        background-color: ${colors.neutral.lighter};
        border-radius: 50%;
      }
    }
  `};
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
          <div className="title-info">
            <div className="title-name">{ux.task.title}</div>
            <div className="title-divider">|</div>
            <div className="title-due-date">Due {TimeHelper.toShortHumanDateTimeTz(ux.task.dueAtMoment)}</div>
          </div>
          <div className="overview-task-icon">
            <Icon
              type="th"
              onClick={ux.toggleTaskProgressTable}
              className={cn({ 'isShowingTable': !ux.hideTaskProgressTable })} 
            />
          </div>
        </StyledHeadingTitle>
        <TaskProgress
          steps={ux.steps}
          goToStep={ux.goToStepId}
          currentStep={ux.currentStep}
          hideTaskProgressTable={ux.hideTaskProgressTable}
        />
      </ExercisesTaskHeaderWrapper>
    );
  }
}

export default ExercisesTaskHeader;
