import React from 'react';
import { Popover, Overlay, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import Time from '../time';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import omit from 'lodash/omit';
// import { ScoresActions } from '../../flux/scores';

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
    {TH.lateStepCount(this.task)}
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

class LateWorkPopover extends React.PureComponent {

  static propTypes = {
    columnIndex: React.PropTypes.number.isRequired,
    hide: React.PropTypes.func.isRequired,
    task: React.PropTypes.shape({
      id: React.PropTypes.number,
      type: React.PropTypes.string,
    }).isRequired,
  }

  componentWillMount() {
    const Content = this.props.task.type === 'homework' ? HomeworkContent : ReadingContent;
    this.setState({
      content: new Content(this.props.task),
    });
  }

  onButtonClick() {
    if (this.state.content.isAccepted && !TH.hasAdditionalLateWork(this.props.task)) {
      this.props.task.acceptLate()
      ScoresActions.rejectLate(this.state.content.task.id, this.props.columnIndex);
    } else {
      ScoresActions.acceptLate(this.state.content.task.id, this.props.columnIndex);
    }
    this.props.hide();
  }

  render() {
    const { content } = this.state;
    const status = this.props.task.type === 'homework' ? content.score() : content.progress();
    const arrowOffsetTop = TH.hasAdditionalLateWork(this.props.task) ? 128 : 95;
    const popoverProps = omit(this.props, 'hide', 'task', 'show');
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
          <Button className="late-button" onClick={this.onButtonClick}>
            {content.get('button')}
          </Button>
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
    task: React.PropTypes.object.isRequired,
  }

  @observable isShown = false;

  @action.bound show() {
    this.isShown = true;
  }

  @action.bound hide() {
    this.isShown = false;
  }

  getTarget() {
    return ReactDOM.findDOMNode(this.refs.caret);
  }

  render() {
    if (!TH.isLate(this.props.task)) { return null; }

    const caretClass = classnames('late-caret', {
      accepted: this.props.task.is_late_work_accepted && !TH.hasAdditionalLateWork(this.props.task),
    });

    return (
      <div
        className="late-caret-trigger"
        onMouseOver={this.props.onMouseOver}
        onClick={() => this.isShown = true }
        onMouseLeave={this.props.onMouseLeave}>
        <Overlay
          ref="overlay"
          placement="top"
          trigger="click"
          rootClose={true}
          onHide={this.onHide}
          show={this.isShown}
          target={this.getTarget}>
          <LateWorkPopover
            task={this.props.task}
            columnIndex={this.props.columnIndex}
            hide={this.onHide} />
        </Overlay>
        <div ref="caret" className={caretClass} />
      </div>
    );
  }
}
