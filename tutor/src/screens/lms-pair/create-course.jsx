import PropTypes from 'prop-types';
import { React, observer } from 'vendor';
import Wizard from '../new-course/wizard';

@observer
export default
class CreateNewCourse extends React.Component {

  static propTypes = {
      ux: PropTypes.object.isRequired,
  }

  render() {
      const { ux } = this.props;

      return (
          <Wizard ux={ux.createCourseUX} />
      );

  }
}
