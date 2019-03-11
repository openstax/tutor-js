import { React, PropTypes, observer, computed } from '../../helpers/react';
import Courses, { Course } from '../../models/courses-map';
import WarningModal from '../../components/warning-modal';

@observer
class Task extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,

  }

  render() {
    return <p>{this.props.course.name}</p>;
  }
}

@observer
class TaskLoader extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      taskId: PropTypes.string.isRequired,
    }).isRequired,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  componentDidMount() {
    if (this.course) {
      const student = this.course.userStudentRecord;
      if (student && !student.mustPayImmediately) {
        this.course.studentTaskPlans.fetch();
      }
    }
  }

  renderNotAStudent() {
    let onDismiss;
    if (Courses.size) { onDismiss = this.goToMyCourses; }
    return (
      <WarningModal
        onDismiss={onDismiss}
        title="Sorry, you can’t access this assignment"
        message="Either it does not exist or you do not have permission to access it."
      />
    );
  }

  render() {
    if (!this.course) { return this.renderNotAStudent(); }

    return <Task course={this.course} task={this.course.studentTaskPlans} />;
  }

}

export { Task, TaskLoader };
