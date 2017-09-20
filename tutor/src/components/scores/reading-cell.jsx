import React from 'react';
import ReactDOM from 'react-dom';
import TutorLink from '../link';
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

  getPieChartTarget() {
    return ReactDOM.findDOMNode(this.refs.pieChart);
  }

  render() {
    const { task, courseId, isConceptCoach, columnIndex, period_id } = this.props;

    return (
      <div className="scores-cell" onMouseOver={this.show} onMouseLeave={this.hide}>
        <div className="worked wide">
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
                    <TutorLink
                      to="viewTaskStep"
                      data-assignment-type={`${task.type}`}
                      params={{ courseId, id: task.id, stepIndex: 1 }}
                    >
                      Review
                    </TutorLink>
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
          task={task}
          onMouseOver={this.show}
          onMouseLeave={this.hide}
          columnIndex={columnIndex} />
      </div>
    );
  }
}
