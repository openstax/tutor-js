import {
  React, PropTypes, observer, action, observable,
} from '../../helpers/react';
import Course from '../../models/course';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';

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

    const period = course.periods.find(period => !period.is_archived);
    await period.becomeStudent();

    const role = course.roles.teacherStudent;
    await role.become();

    this.context.router.history.push(`/course/${course.id}`);
  }

  render() {
    const { course } = this.props;

    if (!course || !course.isTeacher) { return null; }

    if (this.isCreating) {
      return (
        <Button variant="link" disabled>
          <Icon type="spinner" spin />
          Creating student record…
        </Button>
      );
    }

    return (
      <Button
        variant="link"
        onClick={this.onBecomeStudentClick}
      >
        <Icon type="glasses" />
        View as student
      </Button>
    );
  }
}
