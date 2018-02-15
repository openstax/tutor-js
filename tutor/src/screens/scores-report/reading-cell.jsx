import React from 'react';
import ReactDOM from 'react-dom';
import TutorLink from '../../components/link';
import { Overlay, Popover } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import PieProgress from './pie-progress';
import { LateWork } from './late-work';

import TH from '../../helpers/task';

@observer
export default class ReadingCell extends React.PureComponent {

  static propTypes = {
    className: React.PropTypes.string,
    period_id: React.PropTypes.string,
    courseId: React.PropTypes.string.isRequired,
    isConceptCoach: React.PropTypes.bool,
    columnIndex: React.PropTypes.number.isRequired,
    task: React.PropTypes.shape({
      id: React.PropTypes.number,
      type: React.PropTypes.string,
      status: React.PropTypes.string,
    }).isRequired,
  }

  @observable isShowingPopover = false;

  @action.bound show() {
    this.isShowingPopover = true;
  }

  @action.bound hide() {
    this.isShowingPopover = false;
  }

  @action.bound getPieChartTarget() {
    return ReactDOM.findDOMNode(this.refs.pieChart);
  }

  renderReviewLink() {
    const { task, courseId, period } = this.props;

    if (!period.course.isTeacher) {
      return null;
    }

    return (
      <div className="row">
        <div>
          <TutorLink
            to="viewTaskStep"
            data-assignment-type={`${task.type}`}
            params={{ courseId, id: task.id, stepIndex: 1 }}
          >
            Review
          </TutorLink>
        </div>
      </div>
    );
  }

  renderPopover() {
    const { task, courseId, period_id } = this.props;
    if (!task.isStarted) { return null; }

    return (
      <Overlay
        target={this.getPieChartTarget}
        show={this.isShowingPopover}
        onHide={this.hide}
        placement="left">
        <Popover
          onMouseOver={this.show}
          onMouseLeave={this.hide}
          id={`scores-cell-info-popover-${task.id}`}
          className="scores-scores-tooltip-completed-info">
          <div className="info">
            <div className="row">
              <div>
                Completed {TH.getHumanCompletedPercent(task)}
              </div>
            </div>
            {this.renderReviewLink()}
          </div>
        </Popover>
      </Overlay>
    );
  }

  renderLateWork() {
    const { task, columnIndex } = this.props;


    if (!this.props.period.course.isTeacher) {
      return null;
    }

    return (<LateWork
        task={task}
        onMouseOver={this.show}
        onMouseLeave={this.hide}
        columnIndex={columnIndex}
      />
    );
  }

  render() {
    const { task, isConceptCoach, period_id } = this.props;

    return (
      <div className="scores-cell">
        {task.isStarted && <div className="score">{TH.getScorePercent(task)}%</div>}
        <div className="worked" onMouseOver={this.show} onMouseLeave={this.hide}>
          {this.renderPopover()}
          <PieProgress
            ref="pieChart"
            isConceptCoach={isConceptCoach}
            size={20}
            value={TH.getCompletedPercent(task)}
            isLate={TH.isDue(task)} />
        </div>
        {this.renderLateWork()}
      </div>
    );
  }
}
