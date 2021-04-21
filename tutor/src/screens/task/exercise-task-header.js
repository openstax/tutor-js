import { React, PropTypes, observer, styled, inject, autobind, cn } from 'vendor';
import ExitPracticeButton from '../../components/buttons/exit-practice';
import TaskProgress from '../../components/task-progress';
import Header from '../../components/header';
import Router from '../../helpers/router';
import UX from './ux';
import { colors, breakpoint } from 'theme';
import { Icon } from 'shared';
import Time from '../../components/time';

const StyledHeader = styled(Header)`
  padding-bottom: 8px;

  .sticky-table {
    ${breakpoint.only.mobile`
      margin-left: -${breakpoint.margins.mobile};
      margin-right: -${breakpoint.margins.mobile};
      margin-bottom: -${breakpoint.margins.mobile};
    `};
  }
`;

const StyledHeadingTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.7rem;
  line-height: none;
  width: 100%;
  .title-info {
    padding: 6px;
    padding-left: 0;
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
    }
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
    padding: 0 10px 0 0;
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


const TaskInfo = ({ task }) => {
    let dueInfo = null;
    if (task.due_at)
        dueInfo = (
            <>
                <div className="title-divider">|</div>
                <div className="title-due-date">Due {<Time date={task.due_at} format="concise" />}</div>
            </>
        );

    return (
        <div className="title-info">
            <div className="title-name">{task.title}</div>
            {dueInfo}
        </div>
    );
};
TaskInfo.propTypes = {
    task: PropTypes.object.isRequired,
};

const headerContent = (ux) => {
    return (
        <>
            <StyledHeadingTitle>
                <TaskInfo task={ux.task} />
                <div className="overview-task-icon">
                    <Icon
                        type="th"
                        onClick={ux.toggleTaskProgressTable}
                        className={cn({ 'isShowingTable': !ux.hideTaskProgressTable })}
                    />
                </div>
                <ExitPracticeButton task={ux.task} />
            </StyledHeadingTitle>
            <TaskProgress
                steps={ux.steps}
                goToStep={ux.goToStepId}
                currentStep={ux.currentStep}
                hideTaskProgressTable={ux.hideTaskProgressTable}
            />
        </>
    );
};

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
            <StyledHeader
                unDocked={unDocked}
                headerContent={headerContent(ux)}
                backTo={Router.makePathname('dashboard', { courseId: ux.course.id })}
                backToText='Dashboard'
            />
        );
    }
}

export default ExercisesTaskHeader;
