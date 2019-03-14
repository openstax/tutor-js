import { React, PropTypes, observer, computed, idType } from '../../helpers/react';
import Courses, { Course } from '../../models/courses-map';
import StudentTask from '../../models/student-tasks/task';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import LoadingScreen from 'shared/components/loading-animation';
import UX from './ux';
import reading from './reading';

const TASK_TYPES = {
  reading,
};

const UnknownTaskType = ({ task }) => (
  <h1>Unknown task type "{task.type || 'null'}"</h1>
);

@observer
class TaskLoader extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    task: PropTypes.instanceOf(StudentTask).isRequired,
  }

  ux = new UX({ task: this.props.task })

  render() {
    const { task } = this.props;
    if (task.api.isPendingInitialFetch) {
      return <LoadingScreen message="Loading Assignment…" />;
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

    return (
      <TaskLoader
        key={this.task}
        course={this.course}
        task={this.task}
      />
    );
  }

};
