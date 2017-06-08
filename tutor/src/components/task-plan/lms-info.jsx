import React from 'react';
import { uniqueId } from 'lodash';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Markdown } from 'shared';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import moment from 'moment';
import { autobind } from 'core-decorators';

import TourAnchor from '../tours/anchor';
import BindStoreMixin from '../bind-store-mixin';
import TaskPlanHelper from '../../helpers/task-plan';
import LoadableItem from '../loadable-item';
import CopyOnFocusInput from '../copy-on-focus-input';
import Icon from '../icon';
import Courses from '../../models/courses-map';
import { TaskPlanStatsStore, TaskPlanStatsActions } from '../../flux/task-plan-stats';
import TeacherTaskPlans from '../../models/teacher-task-plans';

const DUE_FORMAT = 'M/D/YYYY [at] h:mma';

@observer
export class LmsInfoLink extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    plan: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
    }).isRequired,
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
    const taskPlan = TeacherTaskPlans
      .forCourseId(this.props.courseId)
      .get(this.props.plan.id);

    const taskPlanDates = TaskPlanHelper.dates( taskPlan, { only: 'due_at' } );
    if (taskPlanDates.all != null) {
      return (
        <p>
          {'Due: '}
          {moment(taskPlanDates.all.due_at).format(DUE_FORMAT)}
        </p>
      );
    }
    const course = Courses.get(this.props.courseId);
    const periodDates = course.periods.map(period =>
      <li key={period.id}>{period.name}: {moment(taskPlanDates[period.id].due_at).format(DUE_FORMAT)}</li>
    );
    return (
      <div>
        <p>Due:</p>
        <ul>
          {periodDates}
        </ul>
      </div>
    );
  }

  @computed get url() {
    const l = window.location;
    const { shareable_url } = this.getStats();
    return `${l.protocol}//${l.host}${shareable_url}`;
  }

  @computed get isPreview() {
    return Courses.get(this.props.courseId).is_preview;
  }

  @computed get popOverBody() {
    if (this.isPreview) {
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

  @computed get popoverTitle() {
    return this.isPreview ? 'No assignment links for preview courses' :
           'Copy information for your LMS';
  }

  @computed get popoverDescription() {
    const { description } = this.props.plan;
    return description ? (
      <div>
        Description:
        <Markdown className="description" text={description} block={true} />
      </div>
    ) : undefined;
  }

  @computed get popOver() {
    return (
      <Popover
        id={uniqueId('sharable-link-popover')}
        className="lms-sharable-link"
        title={
          <span>
            {this.popoverTitle}
            <Icon type="close" onClick={this.closePopOver} className="close" />
          </span>
        }
      >
        {this.popOverBody}
      </Popover>
    );
  }

  getStats() {
    return TaskPlanStatsStore.get(this.props.plan.id) || {};
  }

  render() {
    if (!this.getStats().shareable_url) { return null; }

    return (
      <div className="lms-info">
        <OverlayTrigger
          trigger="click"
          placement="top"
          ref="overlay"
          overlay={this.popOver}
        >
          <TourAnchor
            tag='a'
            onClick={this.togglePopover}
            className='get-link' id="lms-info-link"
          >
            Get assignment link
          </TourAnchor>
        </OverlayTrigger>
      </div>
    );
  }
}


export default class LmsInfo extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    plan: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      shareable_url: React.PropTypes.string,
    }).isRequired,
  }

  @autobind
  renderLink() {
    return (
      <LmsInfoLink {...this.props} />
    );
  }

  render() {
    return (
      <LoadableItem
        id={this.props.plan.id}
        store={TaskPlanStatsStore}
        actions={TaskPlanStatsActions}
        renderItem={this.renderLink} />
    );
  }

}
