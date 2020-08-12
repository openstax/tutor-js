import {
  React, PropTypes, withRouter, observer, computed, idType, styled,
} from 'vendor';
import { Redirect } from 'react-router-dom';
import Router from '../../helpers/router';
import { isNil } from 'lodash';
import Courses, { Course } from '../../models/courses-map';
import StudentTask from '../../models/student-tasks/task';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import { BulletList as PendingLoad } from 'react-content-loader';
import Warning from '../../components/warning-modal';
import UX from './ux';
import reading from './reading';
import homework from './homework';
import event from './event';
import Failure from './step/failure';
import external from './external';
import { StepCard } from './step/card';
import { SpyInfo } from './step/spy-info';
import './styles.scss';
import { breakpoint, navbars } from 'theme';

const TASK_TYPES = {
  event,
  reading,
  homework,
  external,
  page_practice: homework,
  practice_worst_topics: homework,
};

const isStepId = (id) => id && id.match(/^\d+$/);

const DeletedTask = () => (
  <Warning title="Assignment cannot be viewed">
    This assignment has been removed by your instructor.
  </Warning>
);

@withRouter
@observer
class Task extends React.Component {

  static displayName = 'Task'

  static propTypes = {
    stepId: idType,
    course: PropTypes.instanceOf(Course).isRequired,
    task: PropTypes.instanceOf(StudentTask).isRequired,
    history: PropTypes.object.isRequired,
  }

  ux = new UX({
    task: this.props.task,
    history: this.props.history,
    stepId: this.props.stepId,
  });

  componentDidUpdate() {
    const { stepId } = this.props;
    if (!isNil(stepId)) {
      this.ux.goToStepId(stepId, false);
    }
  }

  componentWillUnmount() {
    this.ux.isUnmounting();
  }

  render() {
    const { task } = this.props;
    const TaskComponent = TASK_TYPES[task.type];
    if (!TaskComponent) {
      return <Failure task={task} />;
    }
    return <TaskComponent ux={this.ux} />;
  }

}

const StyledTask = styled(Task)`
  ${breakpoint.desktop`
    max-width: 1000px;
  `}
`;

const TaskWrapper = styled.div`
  &&.task-screen .book-page {
    ${breakpoint.only.mobile`
      padding: calc(${breakpoint.margins.mobile} * 2) ${breakpoint.margins.mobile};
    `}
    ${breakpoint.only.tablet`
      padding: calc(${breakpoint.margins.mobile} * 2) ${breakpoint.margins.tablet};
    `}
  }

  ${breakpoint.tablet`
    padding: 0;
    margin-top: calc(-${navbars.top.height} - 2rem);
  `}
`;

export default
@observer
class TaskGetter extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: idType.isRequired,
      id: idType.isRequired,
      stepId: idType,
    }).isRequired,
    course: PropTypes.instanceOf(Course),
  }

  @computed get course() {
    return this.props.course || Courses.get(this.props.params.courseId);
  }

  @computed get task() {
    return this.course && this.course.studentTasks.get(this.props.params.id);
  }

  constructor(props) {
    super(props);
    if (!this.task.api.isFetchedOrFetching) {
      this.task.load();
    }
  }

  render() {
    if (!this.course) {
      return <CourseNotFoundWarning area="assignment" />;
    }

    const { task } = this;
    if (!task || (task.api && task.api.hasErrors)) {
      return <Failure task={task} />;
    }

    if (!task.isLoaded) {
      return <StepCard><PendingLoad /></StepCard>;
    }

    if (task.is_deleted) {
      return <DeletedTask />;
    }
    const { stepId } = this.props.params;
    if (!stepId || (isStepId(stepId) && !task.steps.find(s => s.id == stepId))) {
      const unworkedIndex = task.steps.findIndex(s => !s.is_completed);
      return <Redirect push={false} to={Router.makePathname('viewTaskStep', {
        id: task.id,
        courseId: this.course.id,
        stepId: unworkedIndex > 0 ? task.steps[unworkedIndex].id : 'instructions',
      })} />;
    }

    return (
      <TaskWrapper
        data-test-id="student-task"
        className={`task-screen task-${task.type}`}
      >
        <StyledTask
          key={task}
          course={this.course}
          task={task}
          stepId={this.props.params.stepId}
        />
        <SpyInfo model={task} />
      </TaskWrapper>
    );
  }

}
