import { React, PropTypes } from 'vendor';
import { Card, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import { autobind } from 'core-decorators';
import Time from '../../components/time';
import moment from 'moment';
import Course from '../../models/course';
import EmptyCard from './empty-panel';
import EventRow from './event-row';
import { Row, TitleCell, DueCell, StatusCell, ScoreCell } from './cells';


export default
@observer
class EventsCard extends React.Component {
  static propTypes = {
    events:         PropTypes.array.isRequired,
    course:         PropTypes.instanceOf(Course).isRequired,
    emptyClassName: PropTypes.string,
    emptyMessage:   PropTypes.string,
    spinner:        PropTypes.bool,
    startAt:        PropTypes.object,
    endAt:          PropTypes.object,
    limit:          PropTypes.number,
    title:          PropTypes.string,
    className:      PropTypes.string,
  }

  renderTitle() {
    if (this.props.title) {
      return <span className="title">{this.props.title}</span>;
    }
    return (
      <span className="date-range">
        <Time date={moment(this.props.startAt).toDate()} />
        <span>–</span>
        <Time date={moment(this.props.endAt).toDate()} />
      </span>
    );
  }

  @autobind
  renderEvent(event) {
    return (
      <EventRow
        key={event.id}
        course={this.props.course}
        event={event}
      />
    );
  }

  render() {
    return (
      <Card className={this.props.className}>
        <Row>
          <TitleCell>
            {this.renderTitle()}
          </TitleCell>
          <DueCell>
            Due on
          </DueCell>
          <StatusCell>
            Status
          </StatusCell>
          <ScoreCell>
            Scores
          </ScoreCell>
        </Row>
        {map(this.props.events, this.renderEvent)}
        <EmptyCard
          className={this.props.emptyClassName}
          course={this.props.course}
          message={this.props.emptyMessage}
          spinner={this.props.spinner}
          tasks={this.props.events} />
      </Card>
    );
  }
}
