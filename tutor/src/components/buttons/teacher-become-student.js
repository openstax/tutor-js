import {
  React, PropTypes, observer, action, observable, styled,
} from '../../helpers/react';
import Course from '../../models/course';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';


const BecomeButton = styled(Button).attrs({
  className: 'd-inline-flex align-items-center',
  variant: 'link',
})`

`;

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
    const role = course.roles.teacherStudent;
    if (role) {
      await role.become();
    } else {
      const period = course.periods.find(period => !period.is_archived);
      await period.becomeStudent();
    }
    this.context.router.history.push(`/course/${course.id}`);
  }

  render() {
    const { course } = this.props;

    if (!course || !course.isTeacher) { return null; }

    if (this.isCreating) {
      return (
        <BecomeButton disabled>
          <Icon type="spinner" spin size="2x" />
          Creating student record…
        </BecomeButton>
      );
    }

    return (
      <BecomeButton onClick={this.onBecomeStudentClick}>
        <Icon size="2x" type="glasses" />
        View as student
      </BecomeButton>
    );
  }
}
