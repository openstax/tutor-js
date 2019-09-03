import { React, PropTypes, observer, computed, action, cn, styled } from '../../helpers/react';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { get } from 'lodash';
import Time from '../../components/time';
import Router from '../../helpers/router';
import { Icon } from 'shared';
import HideButton from './hide-button';
import TaskProgressInfo from './task-progress-info';
import Course from '../../models/course';
import Theme from '../../theme';

const NotOpenNoticeWrapper=styled.div`
  margin: 1rem 1rem 0 1rem;
  font-size: 12px;
  display: flex;
  min-height: 3rem;
  align-items: center;
  padding-left: 1rem;
  background: ${Theme.colors.neutral.lighter}
`;

const NotOpenNotice = ({ task }) => {
  if (!task.isTeacherStudent || task.isOpen) {
    return null;
  }
  return (
    <NotOpenNoticeWrapper className="not-open-notice">
      <Icon type="eye" /> This assignment is only visible to instructors.
      Open date for students is {moment(task.opens_at).format('MMM Do, h:mm a')}
    </NotOpenNoticeWrapper>
  );
};
NotOpenNotice.propTypes = {
  task: PropTypes.object.isRequired,
};

const EventTime = ({ event }) => {
  if (event.is_deleted) { return null; }
  return <Time date={event.due_at} format="concise" />;
};

EventTime.propTypes = {
  event:     PropTypes.object.isRequired,
};

export default
@observer
class EventRow extends React.Component {

  static propTypes = {
    event:     PropTypes.object.isRequired,
    course:    PropTypes.instanceOf(Course).isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  @action.bound onClick(ev) {
    ev.preventDefault();
    if (this.isViewable) {
      this.context.router.history.push(
        ev.currentTarget.getAttribute('href')
      );
    }
  }

  @computed get isViewable() {
    return get(this.props, 'viewable', this.props.event.isViewable);
  }

  render() {
    const { event, course } = this.props;
    if (event.hidden) { return null; }

    return (
      <React.Fragment>
        <NotOpenNotice task={event} />
        <a
          className={cn(`task row ${event.type}`, {
            viewable: this.isViewable,
            deleted: event.is_deleted,
          })}
          href={Router.makePathname('viewTask', { courseId: course.id, id: event.id })}
          aria-label={`Work on ${event.type}: ${this.props.event.title}`}
          tabIndex={this.isViewable ? 0 : -1}
          onClick={this.onClick}
          onKeyDown={this.isViewable ? this.onKey : undefined}
          data-event-id={this.props.event.id}
        >
          <Col xs={2} sm={1} className="column-icon">
            <i
              aria-label={`${event.type} icon`}
              className={`icon icon-lg icon-${event.type}`} />
          </Col>
          <Col xs={10} sm={5} className="title">
            {event.title}
          </Col>
          <Col xs={5} sm={3} className="due-at">
            <EventTime event={event} />
            <HideButton event={event} />
          </Col>
          <Col xs={5} sm={3} className="feedback">
            <TaskProgressInfo event={event} course={course} />
          </Col>
        </a>
      </React.Fragment>
    );
  }
}
