import { React, PropTypes, styled, observer } from '../../helpers/react';
import Course from '../../models/course';
import { Icon } from 'shared';
import Theme from '../../theme';

const Notice = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Theme.colors.blue_info};
  border: 1px solid ${Theme.colors.neutral.light};
  border-top: 0;
  background-color: ${Theme.colors.neutral.bright};
`;

export default
@observer
class TeacherPendingLoad extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { currentRole, studentTaskPlans } = this.props.course;

    if (studentTaskPlans.api.isPendingInitialFetch ||
        !currentRole.isTeacherStudent ||
        studentTaskPlans.isLatestPresent) {

      return null;
    }

    return (
      <Notice>
        <Icon variant="activity" /> Building assignment.  This may take a few minutes.
      </Notice>
    );
  }
}
