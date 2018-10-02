import React from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import { Col, Button } from 'react-bootstrap';
import { get } from 'lodash';
import Time from '../../components/time';
import Router from '../../helpers/router';
import Icon from '../../components/icon';
import EventInfoIcon from './event-info-icon';
import { Instructions } from '../../components/task/details';
import { SuretyGuard } from 'shared';
import classnames from 'classnames';
import Course from '../../models/course';

@observer
export default class EventRow extends React.PureComponent {

  static propTypes = {
    eventType: React.PropTypes.string.isRequired,
    event:     React.PropTypes.object.isRequired,
    course:    React.PropTypes.instanceOf(Course).isRequired,
    feedback:  React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.element,
    ]).isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @action.bound onClick(ev) {
    ev.preventDefault();
    if (this.isWorkable) {
      this.context.router.history.push(
        ev.currentTarget.getAttribute('href')
      );
    }
  }

  @action.bound
  onHideTask() {
    this.props.event.hide();
  }

  stopEventPropagation(event) {
    event.stopPropagation();
  }

  @computed get isWorkable() {
    return get(this.props, 'workable', this.props.event.canWork);
  }

  render() {
    const { event, course } = this.props;
    let feedback, hideButton, time;

    if (event.hidden) { return null; }

    const classes = classnames(`task row ${this.props.eventType}`, {
      workable: this.isWorkable,
      deleted: event.is_deleted,
    });

    if (event.is_deleted) {
      const guardProps = {
        okButtonLabel: 'Yes',
        onConfirm: this.onHideTask,
        placement: 'top',
        message: (
          <div>
            <p>
              If you remove this assignment, you will lose any progress or feedback you have received.
            </p>
            <p>
              Do you wish to continue?
            </p>
          </div>
        ),
      };

      hideButton = (
        <span>
          <SuretyGuard {...guardProps}>
            <Button className="hide-task" onClick={this.stopEventPropagation}>
              <Icon type="close" />
            </Button>
          </SuretyGuard>
          <span>
            Withdrawn
          </span>
        </span>
      );

    } else {
      time = <Time date={this.props.event.due_at} format="concise" />;
      feedback = [
        <span key="feedback">
          {this.props.feedback}
        </span>,
        <EventInfoIcon key="icon" event={this.props.event} isCollege={course.is_college} />,
      ];
    }

    return (
      <a
        className={classes}
        href={Router.makePathname('viewTask', { courseId: course.id, id: event.id })}
        aria-label={`Work on ${this.props.eventType}: ${this.props.event.title}`}
        tabIndex={this.isWorkable ? 0 : -1}
        onClick={this.onClick}
        onKeyDown={this.isWorkable ? this.onKey : undefined}
        data-event-id={this.props.event.id}
      >
        <Col xs={2} sm={1} className="column-icon">
          <i
            aria-label={`${this.props.eventType} icon`}
            className={`icon icon-lg icon-${this.props.eventType}`} />
        </Col>
        <Col xs={10} sm={6} className="title">
          {this.props.children}
          <Instructions
            task={this.props.event}
            popverClassName="student-dashboard-instructions-popover" />
        </Col>
        <Col xs={5} sm={3} className="feedback">
          {feedback}
        </Col>
        <Col xs={5} sm={2} className="due-at">
          {time}
          {hideButton}
        </Col>
      </a>
    );
  }
}
