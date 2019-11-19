import {
  React, PropTypes, withRouter, observer, computed, inject, idType,
} from 'vendor';
import { Redirect } from 'react-router-dom';
import Router from '../../helpers/router';
import { isNil, findIndex } from 'lodash';
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
import { TaskInfo } from './task-info';
import { TaskFooterControls } from './task-footer-controls';
import { StepCard } from './step/card';
import { SpyInfo } from './step/spy-info';
import './styles.scss';

const TASK_TYPES = {
  event,
  reading,
  homework,
  external,
  page_practice: homework,
  practice_worst_topics: homework,
};

const DeletedTask = () => (
  <Warning title="Assignment cannot be viewed">
    This assignment has been removed by your instructor.
  </Warning>
);

@withRouter
@inject('bottomNavbar')
@observer
class Task extends React.Component {

  static displayName = 'Task'

  static propTypes = {
    stepIndex: idType,
    course: PropTypes.instanceOf(Course).isRequired,
    task: PropTypes.instanceOf(StudentTask).isRequired,
    bottomNavbar: PropTypes.shape({
      left: PropTypes.shape({
        set: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired,
      }).isRequired,
      right: PropTypes.shape({
        set: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired,
      }).isRequired,
    }),
    history: PropTypes.object.isRequired,
  }

  ux = new UX({
    task: this.props.task,
    history: this.props.history,
    stepIndex: this.props.stepIndex,
  });

  componentDidMount() {
    this.props.bottomNavbar.left.set('taskInfo', () =>
      <TaskInfo task={this.props.task} />
    );
    this.props.bottomNavbar.right.set('taskControls', () =>
      <TaskFooterControls task={this.props.task} course={this.ux.course} />
    );
  }

  componentDidUpdate() {
    const { stepIndex } = this.props;
    if (!isNil(stepIndex)) {
      this.ux.goToStep(stepIndex, false);
    }
  }

  componentWillUnmount() {
    this.ux.isUnmounting();
    this.props.bottomNavbar.left.delete('taskInfo');
    this.props.bottomNavbar.right.delete('taskControls');
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

export default
@observer
class TaskGetter extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: idType.isRequired,
      id: idType.isRequired,
      stepIndex: idType,
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
      this.task.fetch();
    }
  }

  render() {
    if (!this.course || this.task.api.hasErrors) {
      return <CourseNotFoundWarning area="assignment" />;
    }
    const { task } = this;
    if (!task || (task.api && task.api.hasErrors)) {
      return <Failure task={task} />;
    }

    if (!task.api.hasBeenFetched) {
      return <StepCard><PendingLoad /></StepCard>;
    }

    if (task.is_deleted) {
      return <DeletedTask />;
    }

    if (!this.props.params.stepIndex) {
      const stepIndex = findIndex(task.steps, { is_completed: false });
      return <Redirect push={false} to={Router.makePathname('viewTaskStep', {
        id: task.id,
        courseId: this.course.id,
        stepIndex: stepIndex == -1 ? 1 : stepIndex + 1,
      })} />;
    }

    return (
      <div className={`task-screen task-${task.type}`}>
        <Task
          key={task}
          course={this.course}
          task={task}
          stepIndex={this.props.params.stepIndex - 1}
        />
        <SpyInfo model={task} />
      </div>
    );
  }

}
