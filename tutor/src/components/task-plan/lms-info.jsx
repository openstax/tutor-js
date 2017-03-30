import React from 'react';
import { uniqueId } from 'lodash';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Markdown } from 'shared';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import moment from 'moment';

import TourAnchor from '../tours/anchor';
import BindStoreMixin from '../bind-store-mixin';
import TaskPlanHelper from '../../helpers/task-plan';
import LoadableItem from '../loadable-item';
import CopyOnFocusInput from '../copy-on-focus-input';
import Icon from '../icon';
import Courses from '../../models/courses';
import { TaskPlanStatsStore, TaskPlanStatsActions } from '../../flux/task-plan-stats';
import { TeacherTaskPlanStore } from '../../flux/teacher-task-plan';

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

  renderDueDates() {
    const taskPlan = TeacherTaskPlanStore.getPlanId(this.props.courseId, this.props.plan.id);
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

  renderPopOver() {
    const { title, description } = this.props.plan;
    const { shareable_url } = this.getStats();
    const l = window.location;
    const url = `${l.protocol}//${l.host}${shareable_url}`;
    const popoverTitle = (
      <div>
        Copy information for your LMS
        <Icon type="close" onClick={this.closePopOver} className="close" />
      </div>
    );
    const popoverDescription = description ? (
      <div>
        Description:
        <Markdown className="description" text={description} block={true} />
      </div>
    ) : undefined;
    return (
      <Popover
        id={uniqueId('sharable-link-popover')}
        className="lms-sharable-link"
        title={popoverTitle}
      >
        <div className="body" onClick={this.focusInput}>
          <CopyOnFocusInput value={url} ref="input" readOnly={true} />
          <a href={url}>
            {title}
          </a>
          {this.renderDueDates()}
          {popoverDescription}
        </div>
      </Popover>

    );
  }

  getStats() {
    return TaskPlanStatsStore.get(this.props.plan.id) || {};
  }

  render() {
    if (!this.getStats().shareable_url) { return null; }
    const course = Courses.get(this.props.courseId);
    if (course.is_preview) { return null; }
    return (
      <div className="lms-info">
        <OverlayTrigger
          trigger="click"
          placement="top"
          ref="overlay"
          overlay={this.renderPopOver()}>
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


const LmsInfo = React.createClass({

  propTypes: {
    courseId: React.PropTypes.string.isRequired,
    plan: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      shareable_url: React.PropTypes.string,
    }).isRequired,
  },

  mixins: [BindStoreMixin],
  bindStore: TeacherTaskPlanStore,

  renderLink() {
    return (
      <LmsInfoLink {...this.props} />
    );
  },

  render() {
    return (
      <LoadableItem
        id={this.props.plan.id}
        store={TaskPlanStatsStore}
        actions={TaskPlanStatsActions}
        renderItem={this.renderLink} />
    );
  },
});


export default LmsInfo;
