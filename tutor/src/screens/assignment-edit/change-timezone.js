import { React, PropTypes, observable, observer, action, styled } from 'vendor';
import Course from '../../models/course';
import TimezoneModal from '../../components/timezone-modal';
import { Button } from 'react-bootstrap';

const StyledButton = styled(Button)`
  && { padding: 0; }
`;

export default
@observer
class ChangeTimezone extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @observable showModal = false

  @action.bound onOpen() {
    this.showModal = true;
  }

  @action.bound onClose() {
    this.showModal = false;
  }

  render() {
    const course = this.props.course;

    return (
      <>
        <StyledButton
          variant="link"
          onClick={this.onOpen}
          data-test-id="change-timezone"
        >
          {course.time_zone}
        </StyledButton>
        <TimezoneModal
          onClose={this.onClose}
          show={this.showModal}
          course={course}
        />
      </>
    );
  }
}
