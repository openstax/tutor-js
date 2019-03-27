import { React, PropTypes, observer, observable, computed } from '../../helpers/react';
import moment from 'moment-timezone';
import { get } from 'lodash';
import NotesSummaryToggle from '../notes/summary-toggle';
import { Icon } from 'shared';
import Course from '../../models/course';
import MilestonesToggle from './milestones-toggle';

const VALID_ROUTE_NAMES = ['viewTaskStepMilestones', 'viewTaskStep', 'viewTask'];


export default
@observer
class CenterControls extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
  }

  @observable static currentTaskStep;

  @computed get course() {
    if (this.props.course) { return this.props.course; }

    const step = CenterControls.currentTaskStep;
    if (step) {

      return get(step, 'task.tasksMap.course');
    }

    return null;
  }

  @computed get taskStep() {
    return CenterControls.currentTaskStep;
  }

  @computed get task() {
    return this.taskStep.task;
  }

  @computed get shouldRender() {
    return Boolean(
      CenterControls.currentTaskStep && this.course,
    );
  }

  render() {
    // const { show, assignment, due, date, hasMilestones } = this.state;
    // if (!show) { return null; }
    if (!this.shouldRender) { return null; }

    const { taskStep, task } = this;

    const date = moment(task.due_at).date();

    return (
      <div className="navbar-overlay">
        <div className="center-control">
          <span className="center-control-assignment">
            {this.task.title}
          </span>
          <div className="icons">
            <span
              className="due-date fa-stack"
              aria-label={`Due on ${date}`}
            >
              <Icon
                className="due-date"
                type="calendar"
                onNavbar={true}
                className="fa-stack-2x"
                tooltipProps={{ placement: 'bottom' }}
                tooltip={`Due ${moment(task.due_at).calendar()}`}
              />
              <strong className="fa-stack-1x calendar-text">
                {date}
              </strong>
            </span>
            <MilestonesToggle taskStep={taskStep} />
            <NotesSummaryToggle
              course={this.course}
              type="reading"
              taskStep={taskStep}
            />
          </div>
        </div>
      </div>
    );
  }
}
