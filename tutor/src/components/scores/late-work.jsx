import React from 'react';
import { Popover, Overlay, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import Time from '../time';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import omit from 'lodash/omit';
import { AsyncButton } from 'shared';
import TaskResult from '../../models/course/scores/task-result';

import TH from '../../helpers/task';

class LateWorkMessages {

  displayName = 'LateWork';

  constructor(task) {
    this.task = task;
    this.isAccepted = this.task.is_late_work_accepted;
    this.status = this.isAccepted ?
                  TH.hasAdditionalLateWork(this.task) ? 'additional' : 'accepted'
:
                  'pending';
  }

  score() {
    if (this.status === 'accepted') {
      return (
        TH.getHumanUnacceptedScore(this.task)
      );
    } else {
      return (
        TH.getHumanScoreWithLateWork(this.task)
      );
    }
  }

  progress() {
    if (this.status === 'accepted') {
      return (
        TH.getHumanUnacceptedProgress(this.task)
      );
    } else {
      return (
        TH.getHumanProgressWithLateWork(this.task)
      );
    }
  }

  lateExerciseCount() {
    return (
      this.task.completed_exercise_count - this.task.completed_on_time_exercise_count
    );
  }

  lateDueDate() {
    if (this.status === 'accepted') {
      return (
        'due date'
      );
    } else {
      return (
        <Time date={this.task.last_worked_at} format="shortest" />
      );
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
    return (
      {
        additional: 'Additional late work',
        accepted:   'You accepted this student\'s late score.',
        pending:    `${this.lateExerciseCount()} questions worked after the due date`,
      }
    );
  }
  button() {
    return (
      {
        additional: 'Accept new late score',
        accepted:   'Use this score',
        pending:    'Accept late score',
      }
    );
  }
  body() {
    return (
      {
        additional:
  <div className="body">
    {'\
      This student worked '}
    {this.task.lateStepCount}
    {` questions
      after you accepted a late score
      on `}
    <Time date={this.task.accepted_late_at} format="shortest" />
    {'.\
      '}
  </div>,
      }
    );
  }
}


class ReadingContent extends LateWorkMessages {

  reportingOn = 'Progress';

  title() {
    return (
      {
        additional: 'Additional late work',
        accepted:   'You accepted this student\'s late reading progress.',
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

export class LateWorkPopover extends React.PureComponent {

  static propTypes = {
    columnIndex: React.PropTypes.number.isRequired,
    hide: React.PropTypes.func.isRequired,
    task: React.PropTypes.instanceOf(TaskResult).isRequired,
  }

  @computed get content() {
    const Content = this.props.task.type === 'homework' ? HomeworkContent : ReadingContent;
    return new Content(this.props.task);
  }

  @action.bound onButtonClick() {
    if (this.content.isAccepted && !TH.hasAdditionalLateWork(this.props.task)) {
      this.props.task.rejectLate().then(this.props.hide);
      //      ScoresActions.rejectLate(this.content.task.id, this.props.columnIndex);
    } else {
      this.props.task.acceptLate().then(this.props.hide);

      //      ScoresActions.acceptLate(this.content.task.id, this.props.columnIndex);
    }
    // this.props.hide();
  }

  render() {
    const { content } = this;

    const status = this.props.task.type === 'homework' ? content.score() : content.progress();
    const arrowOffsetTop = TH.hasAdditionalLateWork(this.props.task) ? 128 : 95;
    const popoverProps = omit(this.props, 'hide', 'task', 'show', 'columnIndex');
    return (
      <Popover
        {...popoverProps}
        arrowOffsetTop={arrowOffsetTop}
        title={content.get('title')}
        id={`late-work-info-popover-${content.task.id}`}
        className={content.className()}>
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
          <AsyncButton
            className="late-button"
            onClick={this.onButtonClick}
            isWaiting={this.props.task.hasApiRequestPending}
            waitingText="Saving…"
          >
            {content.get('button')}
          </AsyncButton>
        </div>
      </Popover>
    );
  }
}


@observer
export class LateWork extends React.PureComponent {

  static propTypes = {
    onMouseOver:  React.PropTypes.func.isRequired,
    onMouseLeave: React.PropTypes.func.isRequired,
    columnIndex: React.PropTypes.number.isRequired,
    task: React.PropTypes.instanceOf(TaskResult).isRequired,
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
    if (!this.props.task.isLate) { return null; }

    const caretClass = classnames('late-caret', {
      accepted: this.props.task.is_late_work_accepted && !TH.hasAdditionalLateWork(this.props.task),
    });

    return (
      <div
        className="late-caret-trigger"
        onMouseOver={this.props.onMouseOver}
        onClick={this.show}
        onMouseLeave={this.props.onMouseLeave}>
        <Overlay
          ref="overlay"
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
        <div ref="caret" className={caretClass} />
      </div>
    );
  }
}
