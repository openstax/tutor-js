import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Popover } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import TH from '../../helpers/task';
import TutorLink from '../link';
import { LateWork } from './late-work';
import PieProgress from './pie-progress';

const HomeworkScore = ({ task, displayAs, courseId }) => {

  const scorePercent = TH.getHumanScorePercent(task);
  const scoreNumber = TH.getHumanScoreNumber(task);
  const completed = task.completed_exercise_count === task.exercise_count;
  const scoreText = completed || TH.isDue(task) ? displayAs === 'number' ? scoreNumber : scorePercent : '---';

  if (TH.isHomeworkTaskStarted(task)) {
    return (
      <div className="score">
        <TutorLink
          to="viewTaskStep"
          data-assignment-type={`${task.type}`}
          params={{ courseId, id: task.id, stepIndex: 1 }}>
          {scoreText}
        </TutorLink>
      </div>
    );
  }

  return (
    <div className="score not-started">
      ---
    </div>
  );

};


@observer
export default class HomeworkCell extends React.PureComponent {

  static propTypes = {
    className: React.PropTypes.string,
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
    return (
      ReactDOM.findDOMNode(this.refs.pieChart)
    );
  }

  render() {
    const { task, isConceptCoach, columnIndex } = this.props;

    return (
      <div className="scores-cell">
        <HomeworkScore {...this.props} />
        <div className="worked" onMouseOver={this.show} onMouseLeave={this.hide}>
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
                    {'Completed '}
                    {TH.getHumanCompletedPercent(task)}
                  </div>
                </div>
                <div className="row">
                  <div>
                    {TH.getHumanProgress(task)} questions
                  </div>
                </div>
              </div>
            </Popover>
          </Overlay>
          <PieProgress
            ref="pieChart"
            isConceptCoach={isConceptCoach}
            size={20}
            value={TH.getCompletedPercent(task)}
            isLate={TH.isDue(task)} />
        </div>
        <LateWork
          onMouseOver={this.show}
          onMouseLeave={this.hide}
          task={task}
          columnIndex={columnIndex} />
      </div>
    );
  }

}
