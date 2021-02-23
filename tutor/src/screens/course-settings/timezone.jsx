import { React, PropTypes, observable, observer, action } from 'vendor';
import { Icon } from 'shared';
import Course from '../../models/course';
import TimezoneModal from '../../components/timezone-modal';

@observer
export default
class SetTimezone extends React.Component {

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
    return (
      <>
        <Icon type="pencil-alt" onClick={this.onOpen} className="control edit-course" />
        <TimezoneModal
          onClose={this.onClose}
          show={this.showModal}
          course={this.props.course}
        />
      </>
    );
  }
}
