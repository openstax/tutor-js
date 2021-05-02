import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Popover } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action, modelize } from 'shared/model'
import { LateWork } from './late-work';
import PieProgress from './pie-progress';
import Correctness from './correctness-value';
import { ScoresTaskResult } from '../../models'
import UX from './ux';

@observer
export default
class HomeworkCell extends React.Component {
    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        className: PropTypes.string,
        columnIndex: PropTypes.number.isRequired,
        task: PropTypes.instanceOf(ScoresTaskResult).isRequired,
    }

    @observable isShowingPopover = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

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

    renderPopover() {
        const { task } = this.props;
        const progress = <PieProgress ref="pieChart" task={task} />;
        if (!task.isStarted) {
            return <div>{progress}</div>;
        }
        return (
            <div className="worked" onMouseOver={this.show} onMouseLeave={this.hide}>

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
                                        {task.humanProgress} questions
                                    </div>
                                </div>
                            </div>
                        </Popover.Content>
                    </Popover>
                </Overlay>
                {progress}
            </div>
        );
    }

    renderLateWork() {
        const { ux, task, columnIndex } = this.props;

        if (!ux.course.currentRole.isTeacher) {
            return null;
        }

        return (
            <LateWork
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
                {this.renderPopover()}
                {this.renderLateWork()}
            </div>
        );
    }
}
