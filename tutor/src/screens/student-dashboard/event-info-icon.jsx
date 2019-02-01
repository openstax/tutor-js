import { React, PropTypes, observer } from '../../helpers/react';
import S from '../../helpers/string';
import Time from '../../models/time';
import moment from 'moment';
import { Icon } from 'shared';
import Theme from '../../theme';
import TourAnchor from '../../components/tours/anchor';

export default
@observer
class EventInfoIcon extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    isCollege:  PropTypes.bool.isRequired,
  }

  render() {
    const { event, isCollege } = this.props;

    const shouldShowLate = isCollege || (event.type === 'homework');
    const now   = moment(Time.now);
    const dueAt = moment(event.due_at);
    const isIncomplete = !event.complete;
    const pastDue      = shouldShowLate && dueAt.isBefore(now);
    const isDueToday   = now.isBetween(dueAt.clone().subtract(1, 'day'), dueAt);
    const workedLate   = event.last_worked_at ? moment(event.last_worked_at).isAfter(dueAt) : false;

    if (!shouldShowLate || ( (!isIncomplete && !workedLate) || (!pastDue && !isDueToday ))) {
      return null;
    }

    const isLate = workedLate || pastDue;

    let color;
    if (isLate) {
      if (event.lateWorkIsAccepted) {
        color = Theme.colors.neutral.lite;
      } else {
        color = Theme.colors.danger;
      }
    } else {
      color = Theme.colors.warning;
    }
    let icon = (
      <Icon
        color={color}
        type={isLate ? 'clock' : 'exclamation-circle'}
      />
    );

    if (pastDue) {
      icon = (
        <TourAnchor
          id="about-late-icon"
          tag="span"
        >{icon}</TourAnchor>
      );
    }

    return icon;
  }
};
