import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Popover } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import Correctness from './correctness-value';
import PieProgress from './pie-progress';
import { LateWork } from './late-work';
import UX from './ux';

@observer
export default
class ReadingCell extends React.Component {

  static propTypes = {
      ux: PropTypes.instanceOf(UX).isRequired,
      className: PropTypes.string,
      columnIndex: PropTypes.number.isRequired,
      task: PropTypes.object.isRequired,
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

  renderPopover() {
      const { task } = this.props;
      if (!task.isStarted) { return null; }

      return (
          <Overlay
              target={this.getPieChartTarget}
              show={this.isShowingPopover}
              onHide={this.hide}
              placement="left"
          >
              <Popover
                  onMouseOver={this.show}
                  onMouseLeave={this.hide}
                  id={`scores-cell-info-popover-${task.id}`}
                  className="scores-scores-tooltip-completed-info"
              >
                  <Popover.Content>
                      <div className="info">
                          <div className="row">
                              <div>
                  Completed {task.humanCompletedPercent}
                              </div>
                          </div>
                          <div className="row">
                              <div>
                                  {task.humanProgress}
                              </div>
                          </div>
                      </div>
                  </Popover.Content>
              </Popover>
          </Overlay>
      );
  }

  renderLateWork() {
      const { ux, task, columnIndex } = this.props;

      if (!ux.course.currentRole.isTeacher) {
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
      const { ux, task } = this.props;

      return (
          <div className="scores-cell">
              <Correctness ux={ux} task={task} />
              <div className="worked" onMouseOver={this.show} onMouseLeave={this.hide}>
                  {this.renderPopover(task)}
                  <PieProgress task={task} ref="pieChart" />
              </div>
              {this.renderLateWork()}
          </div>
      );
  }
}
