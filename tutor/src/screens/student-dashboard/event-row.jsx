import { React, PropTypes, withRouter, observer, computed, action, cn, styled, modelize } from 'vendor';
import { get } from 'lodash';
import Time from '../../components/time';
import TimeHelper from '../../helpers/time';
import Router from '../../helpers/router';
import { Icon } from 'shared';
import HideButton from './hide-button';
import { TaskStatus, TaskScore } from './task-info';
import { Course } from '../../models';
import EventTypeIcon from './event-type-icon';
import { Row, MobileRow, TitleCell, DueCell, StatusCell, ScoreCell } from './cells';
import { EIcon } from '../../components/icons/extension';
import Responsive from '../../components/responsive';

const NotOpenNoticeWrapper = styled.div`
  margin: 1rem 1rem 0 1rem;
  font-size: 12px;
  display: flex;
  min-height: 3rem;
  align-items: center;
  padding-left: 1rem;
  background: ${({ theme }) => theme.colors.neutral.lighter};
`;

const TaskRow = styled(Row)`
  background: white;
  border-top: 2px solid #f1f1f1;
  transition: all 0.1s ease-in;
  ${({ theme }) => theme.breakpoint.mobile`
     ${fitContentHeight}
  `}

${({ theme }) => theme.breakpoint.tablet`
     ${fitContentHeight}
  `}
`;

const fitContentHeight = `
  &&& {
    height: fit-content;
    max-height: none;
  }
`;

const ClickableInfoRow = styled(Row).attrs({
    as: 'a',
})`
  display: contents;
  color: #424242;
  :hover {
    color: #424242;
  }
`;

const StyledEIcon = styled(EIcon)`
  margin-left: 0.5rem;
`;

const timeFormat = TimeHelper.HUMAN_DATE_TIME_TZ_FORMAT;

const NotOpenNotice = ({ task, course }) => {
    if (!task.isTeacherStudent || task.isOpen) {
        return null;
    }

    return (
        <NotOpenNoticeWrapper className="not-open-notice">
            <Icon type="eye" /> This assignment is only visible to instructors.
            Open date for students is {course.dateTimeInZone(task.opens_at).toFormat(timeFormat)}
        </NotOpenNoticeWrapper>
    );
};
NotOpenNotice.propTypes = {
    task: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
};

const EventTime = ({ event }) => {
    if (event.is_deleted) { return null; }
    return <Time date={event.due_at} format="concise" />;
};
EventTime.propTypes = {
    event: PropTypes.object.isRequired,
};

@withRouter
@observer
export default
class EventRow extends React.Component {
    static propTypes = {
        event:   PropTypes.object.isRequired,
        course:  PropTypes.instanceOf(Course).isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onClick(ev) {
        ev.preventDefault();
        if (this.isViewable) {
            this.props.history.push(
                ev.currentTarget.getAttribute('href')
            );
        }
    }

    @action.bound onHitEnter(ev) {
        if(ev.key === 'Enter')
            this.onClick(ev);
    }

    @computed get isViewable() {
        return get(this.props, 'viewable', this.props.event.isViewable);
    }

    renderDesktop() {
        const { event, course } = this.props;
        return (
            <>
                <ClickableInfoRow
                    href={Router.makePathname('viewTask', { courseId: course.id, id: event.id })}
                    onClick={this.onClick}
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
                </ClickableInfoRow>
                <ScoreCell>
                    <TaskScore event={event} course={course} />
                </ScoreCell>
            </>
        );
    }

    renderMobile() {
        const { event, course } = this.props;
        return (
            <MobileRow>
                <a
                    href={Router.makePathname('viewTask', { courseId: course.id, id: event.id })}
                    onClick={this.onClick}
                >
                    <div className="assignment-title-icon">
                        <EventTypeIcon event={event} />
                        <span className="assignment-title">{event.title}</span>
                    </div>
                    <div className="mobile-event-info-container">
                        <div className="mobile-event-info">
                            <span>Due on</span>
                            <span>
                                <EventTime event={event} />
                                {event.is_extended && <StyledEIcon />}
                            </span>
                        </div>
                        <div className="mobile-event-info">
                            <span>Status</span>
                            <span>
                                <TaskStatus event={event} course={course} />
                            </span>
                        </div>
                    </div>
                </a>
                <div className="mobile-event-info-container">
                    <div className="mobile-event-info">
                        <span>Score</span>
                        <TaskScore event={event} course={course} />
                    </div>
                </div>
            </MobileRow>
        );
    }

    render() {
        const { event, course } = this.props;
        if (event.isHidden) { return null; }

        return (
            <>
                <NotOpenNotice task={event} course={course} />
                <TaskRow
                    className={cn(`task ${event.type}`, {
                        viewable: this.isViewable,
                        deleted: event.is_deleted,
                    })}
                    aria-label={`Work on ${event.type}: ${this.props.event.title}`}
                    tabIndex={this.isViewable ? 0 : -1}
                    href={Router.makePathname('viewTask', { courseId: course.id, id: event.id })}
                    onKeyDown={this.isViewable ? this.onHitEnter : undefined}
                    data-event-id={this.props.event.id}
                >
                    <Responsive
                        desktop={this.renderDesktop()}
                        mobile={this.renderMobile()}
                    />

                </TaskRow>
            </>
        );
    }
}
