import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip, OverlayTrigger }  from 'react-bootstrap';
import S from '../../helpers/string';
import { TimeStore } from '../../flux/time';
import moment from 'moment';
import Icon from '../../components/icon';
import { observer } from 'mobx-react';

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
    // TODO this is naive and not timezone aware.  As a hotfix, this should suffice.
    const now   = moment(TimeStore.getNow());
    const dueAt = moment(event.due_at);
    const isIncomplete = !event.complete;
    const pastDue      = shouldShowLate && dueAt.isBefore(now);
    const isDueToday   = now.isBetween(dueAt.clone().subtract(1, 'day'), dueAt);
    const workedLate   = event.last_worked_at ? moment(event.last_worked_at).isAfter(dueAt) : false;

    if (!shouldShowLate || ( (!isIncomplete && !workedLate) || (!pastDue && !isDueToday ))) {
      return null;
    }

    const isLate = workedLate || pastDue;

    const tooltip =
      <Tooltip id={`event-info-icon-${event.id}`}>
        <b>
          {S.capitalize(isLate ? 'late' : 'incomplete')}
        </b>
      </Tooltip>;


    let icon = (
      <Icon
        tooltip={tooltip}
        variant={isLate ? 'warning' : 'danger'}
        type={isLate ? 'clock' : 'exclamation-circle'}
      />
    );

    //  <OverlayTrigger placement="top" overlay={tooltip}>
    //     <i className={`info ${status}`} />
    //  </OverlayTrigger>;

    if (pastDue) {
      icon = <TourAnchor
        id="about-late-icon"
        tag="span"
      >{icon}</TourAnchor>;
    }

    return icon;
  }
};
