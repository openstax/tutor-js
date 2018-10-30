import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import moment from 'moment-timezone';
import classnames from 'classnames';
import { cloneDeep, extend, includes, omit, pick, get } from 'lodash';
import AnnotationsSummaryToggle from '../annotations/summary-toggle';
import Icon from '../icon';
import { TaskStore } from '../../flux/task';
import { TaskPanelStore } from '../../flux/task-panel';
import TutorRouter from '../../helpers/router';
import TutorLink from '../link';

const VALID_ROUTE_NAMES = ['viewTaskStepMilestones', 'viewTaskStep', 'viewTask'];

@observer
export default class CenterControls extends React.Component {

  static propTypes = {
    shouldShow: React.PropTypes.bool,
    params:     React.PropTypes.object,
    pathname:   React.PropTypes.string,
  }

  static defaultProps = {
    shouldShow: false,
  }

  constructor(props) {
    super(props);
    const params = this.getParams();
    const taskInfo = this.getTaskInfo(params);
    const controlInfo = this.getControlInfo(params);

    this.state = extend({}, taskInfo, controlInfo);
  }

  getParams(params) {
    if (params == null) { ({ params } = this.props); }

    params = cloneDeep(params) || {};
    if (params.stepIndex == null) {
      params.stepIndex = TaskPanelStore.getStepKey(params.id, { is_completed: false });
    }
    return params;
  }

  componentWillMount() {
    TaskStore.on('loaded', this.updateTask);
    TaskPanelStore.on('loaded', this.updateControls);
  }

  componentWillUnmount() {
    TaskStore.off('loaded', this.updateTask);
    TaskPanelStore.off('loaded', this.updateControls);
  }

  componentWillReceiveProps(nextProps) {
    this.updateControls(nextProps.params, window.location.pathname);
  }

  shouldShow(path) {
    const { shouldShow } = this.props;
    if (shouldShow) { return true; }
    if (path == null) { path = this.props.pathname; }
    const match = TutorRouter.currentMatch(path);
    return match && includes(VALID_ROUTE_NAMES, match.entry.name);
  }

  update(getState, params, path) {
    const show = this.shouldShow(path);
    if (!show) {
      this.setState({ show });
      return;
    }
    params = this.getParams(params);
    const state = getState(params);
    if (state != null) {
      this.setState(state);
    }
  }

  @action.bound
  updateControls(params, path) {
    this.update(this.getControlInfo, params, path);
  }

  @action.bound
  updateTask(taskId) {
    const { params } = this.props;
    if (taskId === params.id) { this.update(this.getTaskInfo); }
  }

  @action.bound
  getTaskInfo(params) {
    const { id } = params;
    const task = TaskStore.get(id);
    if (!task || get(task, 'type') !== 'reading') { return { show: false }; }

    return {
      show: true,
      assignment: task.title,
      due: this.reformatTaskDue(task.due_at),
      date: this.getDate(task.due_at),
    };
  }

  @action.bound
  reformatTaskDue(due_at) {
    return `Due ${moment(due_at).calendar()}`;
  }

  getDate(due_at) {
    return `${moment(due_at).date()}`;
  }

  @action.bound
  getControlInfo(params) {
    const hasMilestones = this.hasMilestones(params);
    const linkParams = this.getLinkProps(params, hasMilestones);
    return extend({}, linkParams, { hasMilestones });
  }

  hasMilestones(params) {
    return Boolean(params.milestones);
  }

  getLinkProps(params, hasMilestones) {
    if (!params.id || !params.courseId) { return { show: false }; }

    if (hasMilestones) {
      return {
        params: omit(params, 'milestones'),
        to: 'viewTaskStep',
      };
    } else {
      return {
        params: extend({ milestones: 'milestones' }, params),
        to: 'viewTaskStepMilestones',
      };
    }
  }

  render() {
    const { show, assignment, due, date, hasMilestones } = this.state;
    if (!show) { return null; }

    const linkProps = pick(this.state, 'to', 'params');

    const milestonesToggleClasses = classnames(
      'milestones-toggle',
      { 'active': hasMilestones }
    );

    return (
      <div className="navbar-overlay">
        <div className="center-control">
          <span className="center-control-assignment">
            {assignment}
          </span>
          <div className="icons">
            <span
              className="due-date fa-stack"
              aria-label={`Due on ${date}`}
            >
              <Icon
                className="due-date"
                type="calendar-o"
                onNavbar={true}
                className="fa-stack-2x"
                tooltipProps={{ placement: 'bottom' }}
                tooltip={due} />
              <strong className="fa-stack-1x calendar-text">
                {date}
              </strong>
            </span>
            <TutorLink
              {...linkProps}
              ref="milestonesToggle"
              activeClassName=""
              className={milestonesToggleClasses}>
              <Icon type="th" />
            </TutorLink>
            <AnnotationsSummaryToggle
              courseId={this.state.params.courseId}
              type="reading"
              taskId={linkProps.params.id}
              taskStepIndex={linkProps.params.stepIndex}
              params={linkProps.params}
            />
          </div>
        </div>
      </div>
    );
  }
}
