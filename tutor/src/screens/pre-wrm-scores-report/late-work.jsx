import PropTypes from 'prop-types';
import React from 'react';
import { Popover, Overlay } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import Time from '../../components/time';
import classnames from 'classnames';
import omit from 'lodash/omit';
import TaskResult from '../../models/scores/task-result';

class LateWorkMessages {

  displayName = 'LateWork';

  constructor(task) {
    this.task = task;
  }

  @computed get status() {
    if (this.task.is_late_work_accepted) {
      return this.task.hasAdditionalLateWork ? 'additional' : 'accepted';
    }
    return 'pending';
  }

  @computed get isAccepted() {
    return Boolean(
      this.task.is_late_work_accepted && !this.task.hasAdditionalLateWork
    );
  }

  score() {
    return this.task.humanScore;
  }

  progress() {
    return this.task.humanProgress;
  }

  lateExerciseCount() {
    return (this.task.completed_exercise_count - this.task.completed_on_time_exercise_count) || 0;
  }

  lateDueDate() {
    if (this.isAccepted && this.task.last_worked_at) {
      return 'due date';
    } else {
      return <Time date={this.task.last_worked_at} format="shortest" />;
    }
  }

  className() {
    return (
      classnames( 'late-work-info-popover', this.keyword, this.status, {
        'is-accepted': this.isAccepted,
      })
    );
  }

  get(type) {
    const msg = this[type]();
    return msg ? msg[this.status] : '';
  }
}


class HomeworkContent extends LateWorkMessages {
  reportingOn = 'Score';

  title() {
    return {
      additional: 'Additional late work',
      accepted:   'You accepted this student’s late score.',
      pending:    `${this.lateExerciseCount()} questions worked after the due date`,
    };
  }

  button() {
    return {
      additional: 'Accept new late score',
      accepted:   'Use this score',
      pending:    'Accept late score',
    };
  }

  body() {
    return {
      additional: (
        <div className="body">
          This student worked {this.task.unacceptedLateStepCount} questions
          after you accepted a late score
          on <Time date={this.task.accepted_late_at || new Date()} format="shortest" />.
        </div>
      ),
    };
  }

}


class ReadingContent extends LateWorkMessages {

  reportingOn = 'Progress';

  title() {
    return (
      {
        additional: 'Additional late work',
        accepted:   'You accepted this student’s late reading progress.',
        pending:    'Reading progress after the due date',
      }
    );
  }
  button() {
    return (
      {
        additional: 'Accept new late progress',
        accepted:   'Use this progress',
        pending:    'Accept late progress',
      }
    );
  }
  body() {
    return (
      null
    );
  }
}

class LateWorkPopover extends React.Component {

  static propTypes = {
    columnIndex: PropTypes.number.isRequired,
    hide: PropTypes.func.isRequired,
    task: PropTypes.instanceOf(TaskResult).isRequired,
  }

  @computed get content() {
    const Content = this.props.task.type === 'homework' ? HomeworkContent : ReadingContent;
    return new Content(this.props.task);
  }

  @action.bound onButtonClick() {
    if (this.content.isAccepted && !this.props.task.hasAdditionalLateWork) {
      this.props.task.rejectLate().then(this.props.hide);
    } else {
      this.props.task.acceptLate().then(this.props.hide);
    }
  }

  render() {
    const { content } = this;

    const status = this.props.task.type === 'homework' ? content.score() : content.progress();
    const popoverProps = omit(this.props, 'hide', 'task', 'show', 'columnIndex');
    return (
      <Popover
        {...popoverProps}
        id={`late-work-info-popover-${content.task.id}`}
        className={content.className()}
      >
        <Popover.Title>{content.get('title')}</Popover.Title>
        <Popover.Content>
          <div className="late-status">
            {content.get('body')}
            <div className="description">
              <span className="title">
                {content.reportingOn} on {content.lateDueDate()}:
              </span>
              <span className="status">
                {status}
              </span>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    );
  }
}


@observer
class LateWork extends React.Component {

  static propTypes = {
    onMouseOver:  PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    columnIndex: PropTypes.number.isRequired,
    task: PropTypes.instanceOf(TaskResult).isRequired,
  }

  @observable isShown = false;

  @action.bound show() {
    this.isShown = true;
  }

  @action.bound hide() {
    this.isShown = false;
  }

  @action.bound getTarget() {
    return this.refs.caret;
  }

  render() {
    const { task } = this.props;

    if (task.completed_step_count == task.completed_on_time_steps_count) {
      return null;
    }

    return (
      <div
        className="late-caret-trigger"
        onMouseOver={this.props.onMouseOver}
        onClick={this.show}
        onMouseLeave={this.props.onMouseLeave}>
        <Overlay
          placement="top"
          trigger="click"
          rootClose={true}
          onHide={this.hide}
          show={this.isShown}
          target={this.getTarget}>
          <LateWorkPopover
            task={this.props.task}
            columnIndex={this.props.columnIndex}
            hide={this.hide} />
        </Overlay>
        <div ref="caret" className="late-caret" />
      </div>
    );
  }
}

export { LateWorkPopover, LateWork };
