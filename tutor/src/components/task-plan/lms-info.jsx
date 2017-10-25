import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import moment from 'moment';
import { autobind } from 'core-decorators';
import TaskPlanHelper from '../../helpers/task-plan';
import CopyOnFocusInput from '../copy-on-focus-input';
import Icon from '../icon';
import Courses from '../../models/courses-map';
import CopyOnfocusInput from '../copy-on-focus-input';
import TeacherTaskPlan from '../../models/task-plan/teacher';

const DUE_FORMAT = 'M/D/YYYY [at] h:mma';

@observer
export default class LmsInfoPanel extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    plan: React.PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    onBack: React.PropTypes.func.isRequired,
  }

  @action.bound
  focusInput() {
    this.refs.input.focus();
  }

  @action.bound
  closePopOver() {
    this.refs.overlay.hide();
  }

  @autobind
  renderDueDates() {
    const { plan } = this.props;

    const taskPlanDates = TaskPlanHelper.dates( plan, { only: 'due_at' } );
    if (taskPlanDates.all != null) {
      return (
        <CopyOnFocusInput
          label="Due date"
          value={moment(taskPlanDates.all.due_at).format(DUE_FORMAT)}
        />
      );
    }
    const course = Courses.get(this.props.courseId);
    const periodDates = course.periods.map(period => (
      <CopyOnFocusInput
        label={period.name}
        value={moment(taskPlanDates[period.id].due_at).format(DUE_FORMAT)}
      />
    ));

    return (
      <div>
        <p>Due dates:</p>
        <ul>
          {periodDates}
        </ul>
      </div>
    );
  }

  @computed get url() {
    const l = window.location;
    const { shareable_url } = this.props.plan.analytics;
    return shareable_url ? `${l.protocol}//${l.host}${shareable_url}` : '';
  }

  @computed get isPreview() {
    return Courses.get(this.props.courseId).is_preview;
  }

  @computed get popOverBody() {
    if (this.isPreview || !this.url) {
      return (
        <div className="body">
          {this.props.plan.title}
          {this.renderDueDates()}
          {this.popoverDescription}
        </div>
      );
    }
    return (
      <div className="body" onClick={this.focusInput}>
        <CopyOnFocusInput value={this.url} ref="input" readOnly={true} />
        <a href={this.url}>{this.props.plan.title}</a>
        {this.renderDueDates()}
        {this.popoverDescription}
      </div>
    );
  }

  renderPreview() {
    return (
      <div className="lms-info preview">
        <a className="back" onClick={this.props.onBack}>
          <Icon type="chevron-left" /> Back
        </a>
        <p>
          Assignment links are not available in preview courses. In
          a live course, you can send assignment links directly
          to your students or manually paste them into your
          learning management system.
        </p>
      </div>
    );
  }

  render() {
    if (this.isPreview) {
      return this.renderPreview();
    }
    return (
      <div className="lms-info">
        <a className="back" onClick={this.props.onBack}>
          <Icon type="chevron-left" /> Back
        </a>
        <p>
          Copy and send to your students directly, or paste manually into your LMS.
        </p>
        <CopyOnfocusInput label="Assignment URL" value={this.url} />
        {this.renderDueDates()}
      </div>
    );
  }
}
