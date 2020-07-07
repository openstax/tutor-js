import { React, PropTypes, withRouter, observer, computed, action, cn, styled } from 'vendor';
// import { Col } from 'react-bootstrap';
import moment from 'moment';
import { get } from 'lodash';
import Time from '../../components/time';
import TimeHelper from '../../helpers/time';
import Router from '../../helpers/router';
import { Icon } from 'shared';
import HideButton from './hide-button';
import { TaskStatus, TaskScore } from './task-info';
import Course from '../../models/course';
import EventTypeIcon from './event-type-icon';
import { Row, TitleCell, DueCell, StatusCell, ScoreCell } from './cells';
import { EIcon } from '../../components/icons/extension';

const NotOpenNoticeWrapper=styled.div`
  margin: 1rem 1rem 0 1rem;
  font-size: 12px;
  display: flex;
  min-height: 3rem;
  align-items: center;
  padding-left: 1rem;
  background: ${({ theme }) => theme.colors.neutral.lighter};
`;

const timeFormat = TimeHelper.HUMAN_DATE_TIME_TZ_FORMAT;

const NotOpenNotice = ({ task, course }) => {
  if (!task.isTeacherStudent || task.isOpen) {
    return null;
  }

  return (
    <NotOpenNoticeWrapper className="not-open-notice">
      <Icon type="eye" /> This assignment is only visible to instructors.
      Open date for students is {course.momentInZone(task.opens_at).format(timeFormat)}
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


const TaskRow=styled(Row).attrs({
  as: 'a',
})`

`;

const StyledEIcon = styled(EIcon)`
  margin-left: 0.5rem;
`;

export default
@withRouter
@observer
class EventRow extends React.Component {

  static propTypes = {
    event:   PropTypes.object.isRequired,
    course:  PropTypes.instanceOf(Course).isRequired,
    history: PropTypes.object.isRequired,
  }

  @action.bound onClick(ev) {
    ev.preventDefault();
    if (this.isViewable) {
      this.props.history.push(
        ev.currentTarget.getAttribute('href')
      );
    }
  }

  @computed get isViewable() {
    return get(this.props, 'viewable', this.props.event.isViewable);
  }

  render() {
    const { event, course } = this.props;
    if (event.isHidden) { return null; }

    return (
      <React.Fragment>
        <NotOpenNotice task={event} course={course} />
        <TaskRow
          className={cn(`task ${event.type}`, {
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
          <TitleCell>
            <EventTypeIcon event={event} />
            <span>{event.title}</span>
          </TitleCell>
          <DueCell>
            <EventTime event={event} />
            {event.is_extended && <StyledEIcon />}
            <HideButton event={event} />
          </DueCell>
          <StatusCell>
            <TaskStatus event={event} course={course} />
          </StatusCell>
          <ScoreCell>
            <TaskScore event={event} course={course} />
          </ScoreCell>
        </TaskRow>
      </React.Fragment>
    );
  }
}
