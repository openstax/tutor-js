import { React, PropTypes, observer } from 'vendor';
import SettingsPopover from '../../components/icons/settings';
import UX from './ux';

@observer
export default
class Settings extends React.Component {
  static propTypes ={
      ux: PropTypes.instanceOf(UX).isRequired,
  };

  controls = {
      displayScoresAsPoints: 'Display scores as points',
      arrangeColumnsByType: 'Arrange columns by assignment type',
      showDroppedStudents: 'Show dropped students',
  }

  render() {
      return (
          <SettingsPopover
              label="Adjust table display settings"
              ux={this.props.ux}
              controls={this.controls}
          />
      );
  }
}
