import PropTypes from 'prop-types';
import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import { autobind } from 'core-decorators';
import Time from '../../components/time';
import moment from 'moment';
import Course from '../../models/course';
import EmptyCard from './empty-panel';
import EventRow from './event-row';
import TeacherPendingLoad from './teacher-pending-load';

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
        <div className="row labels">
          <Col xs={12} sm={6}>
            {this.renderTitle()}
          </Col>
          <Col
            xs={{ span: 5, offset: 2 }}
            sm={{ span: 3, offset: 0 }}
            className="due-at-label"
          >
            Due
          </Col>
          <Col xs={5} sm={3} className="progress-label">
            Progress
          </Col>
        </div>
        {map(this.props.events, this.renderEvent)}
        <EmptyCard
          className={this.props.emptyClassName}
          course={this.props.course}
          message={this.props.emptyMessage}
          spinner={this.props.spinner}
          tasks={this.props.events} />
        <TeacherPendingLoad course={this.props.course} />
      </Card>
    );
  }
}
