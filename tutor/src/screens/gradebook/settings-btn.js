import { React, PropTypes, observer } from 'vendor';
import SettingsPopover from '../../components/icons/settings';
import UX from './ux';

export default
@observer
class Settings extends React.Component {
  static propTypes ={
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  controls = {
    displayScoresAsPercent: 'Display scores as percentage %',
    arrangeColumnsByType: 'Arrange columns by assignment type',
    arrangeColumnsByPoints: 'Arrange columns by points',
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
