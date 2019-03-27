import { React, PropTypes, observer, computed, idType } from '../../helpers/react';
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
import external from './external';

import { StepCard } from './step/card';
import './styles.scss';

const TASK_TYPES = {
  event,
  reading,
  homework,
  external,
  page_practice: homework,
  practice_worst_topics: homework,
};

const UnknownTaskType = ({ ux }) => (
  <Warning title="Unknown task type">
    The task type "{ux.task.type || 'null'}" is unknown.
  </Warning>
);

UnknownTaskType.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};


@observer
class TaskLoader extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    task: PropTypes.instanceOf(StudentTask).isRequired,
    stepIndex: idType,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  ux = new UX({
    task: this.props.task,
    router: this.context.router,
    stepIndex: this.props.stepIndex,
  });

  componentDidUpdate() {
    const { stepIndex } = this.props;
    if (!isNil(stepIndex)) {
      this.ux.goToStep(stepIndex, false);
    }
  }

  componentWillUnmount() {
    this.ux.isUnmounting();
  }

  render() {
    const { task } = this.props;
    if (task.api.isPendingInitialFetch) {
      return <StepCard><PendingLoad /></StepCard>;
    }

    const Task = TASK_TYPES[task.type] || UnknownTaskType;

    return <Task ux={this.ux} />;
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

  render() {
    if (!this.course || this.task.api.hasErrors) {
      return <CourseNotFoundWarning area="assignment" />;
    }

    const stepIndex = this.props.params.stepIndex ?
      this.props.params.stepIndex - 1 : null;

    return (
      <div className="task-screen">
        <TaskLoader
          key={this.task}
          course={this.course}
          task={this.task}
          stepIndex={stepIndex}
        />
      </div>
    );
  }

}
