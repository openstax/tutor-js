import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { autobind } from 'core-decorators';
import TaskPlanHelper from '../helpers/task-plan';
import CopyOnFocusInput from './copy-on-focus-input';
import { Icon } from 'shared';
import Courses from '../models/courses-map';
import TeacherTaskPlan from '../models/task-plans/teacher/plan';
import styled from 'styled-components';

const DUE_FORMAT = 'M/D/YYYY [at] h:mma';

const BackLinkButton = styled(Button)`
  margin: 10px 0 20px 0;
  padding-left: 0 !important;
  font-size: 16px;
`;

const BackLink = (props) => (
  <BackLinkButton variant="link" {...props}>
    <Icon type="chevron-left" /> Back
  </BackLinkButton>
);


export default
@observer
class LmsInfoCard extends React.Component {

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    onBack: PropTypes.func.isRequired,
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
        <BackLink onClick={this.props.onBack} />
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
        <BackLink onClick={this.props.onBack} />
        <p>
          Copy and send to your students directly, or paste manually into your LMS.
        </p>
        <CopyOnFocusInput label="Assignment URL" value={this.url} />
        {this.renderDueDates()}
      </div>
    );
  }
};
