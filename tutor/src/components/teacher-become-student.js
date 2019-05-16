import {
  React, PropTypes, observer, action, observable,
} from '../helpers/react';
import Course from '../models/course';
import { AsyncButton } from 'shared';

export default
@observer
class MyCourses extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  @observable isCreating = false

  @action.bound async onBecomeStudentClick() {
    const { course } = this.props;
    this.isCreating = true;
    await course.periods[0].becomeStudent();
    const role = course.roles.teacherStudent;
    await role.become();
    this.context.router.history.push(`/course/${course.id}`);
  }

  render() {
    const { course } = this.props;

    if (!course || !course.isTeacher) { return null; }

    return (
      <AsyncButton
        isJob={true}
        onClick={this.onBecomeStudentClick}
        waitingText="Creating student records…"
        isWaiting={this.isCreating}
      >Become Student</AsyncButton>
    );
  }
}
