import React from 'react';
import { Tooltip, OverlayTrigger }  from 'react-bootstrap';
import S from '../../helpers/string';
import { TimeStore } from '../../flux/time';
import moment from 'moment';
import { observer } from 'mobx-react';

@observer
export default class EventInfoIcon extends React.PureComponent {
  static propTypes = {
    event: React.PropTypes.object.isRequired,
    isCollege:  React.PropTypes.bool.isRequired,
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

    const status = (workedLate || pastDue) ? 'late' : 'incomplete';

    const tooltip =
      <Tooltip id={`event-info-icon-${event.id}`}>
        <b>
          {S.capitalize(status)}
        </b>
      </Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <i className={`info ${status}`} />
      </OverlayTrigger>
    );
  }
}
