import PropTypes from 'prop-types';
import React from 'react';
import { Panel, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import { autobind } from 'core-decorators';
import Time from '../../components/time';
import moment from 'moment';
import ReadingRow from './reading-row';
import HomeworkRow from './homework-row';
import ExternalRow from './external-row';
import EventTaskRow from './event-task-row';
import GenericEventRow from './generic-event-row';
import Course from '../../models/course';

const ROW_TYPES = {
  reading:  ReadingRow,
  homework: HomeworkRow,
  external: ExternalRow,
  event:    EventTaskRow,
  default:  GenericEventRow,
};


export default
@observer
class EventsPanel extends React.Component {
  static propTypes = {
    events:     PropTypes.array.isRequired,
    course:     PropTypes.instanceOf(Course).isRequired,
    startAt:    PropTypes.object,
    endAt:      PropTypes.object,
    limit:      PropTypes.number,
    title:      PropTypes.string,
    className:  PropTypes.string,
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
    const Row = ROW_TYPES[event.type] || ROW_TYPES.default;
    return (
      <Row
        key={event.id}
        course={this.props.course}
        event={event}
      />
    );
  }

  render() {
    return (
      <Panel className={this.props.className}>
        <div className="row labels">
          <Col xs={12} sm={7}>
            {this.renderTitle()}
          </Col>
          <Col xs={5} xsOffset={2} smOffset={0} sm={3} className="progress-label">
            Progress
          </Col>
          <Col xs={5} sm={2} className="due-at-label">
            Due
          </Col>
        </div>
        {map(this.props.events, this.renderEvent)}
      </Panel>
    );
  }
};
