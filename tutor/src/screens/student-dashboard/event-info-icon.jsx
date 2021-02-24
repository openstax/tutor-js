import { React, PropTypes, observer } from 'vendor';
import { Icon } from 'shared';
import Theme from '../../theme';
import TourAnchor from '../../components/tours/anchor';

@observer
export default
class EventInfoIcon extends React.Component {
  static propTypes = {
      event: PropTypes.object.isRequired,
      isCollege:  PropTypes.bool.isRequired,
  }

  render() {
      const { event, isCollege } = this.props;
      const shouldShowLate = isCollege || (event.type === 'homework');
      const isIncomplete = !event.complete;

      if (!shouldShowLate || ( (!isIncomplete && !event.workedLate) || (!event.isPastDue && !event.isAlmostDue))) {
          return null;
      }

      const isLate = event.workedLate || event.isPastDue;

      let color;
      if (isLate) {
          color = Theme.colors.danger;
      } else {
          color = Theme.colors.warning;
      }
      let icon = (
          <Icon
              color={color}
              type={isLate ? 'clock' : 'exclamation-circle'}
          />
      );

      if (event.isPastDue) {
          icon = (
              <TourAnchor
                  id="about-late-icon"
                  tag="span"
              >{icon}</TourAnchor>
          );
      }

      return icon;
  }
}
