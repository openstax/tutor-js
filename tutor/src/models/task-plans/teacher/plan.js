import {
  BaseModel, identifiedBy, field, session, identifier, hasMany,
} from 'shared/model';
import { action, computed, observable, createAtom } from 'mobx';
import {
  sortBy, first, last, map, union, find,
} from 'lodash';
import { lazyInitialize } from 'core-decorators';
import TaskingPlan from './tasking'
import TaskPlanPublish from '../../jobs/task-plan-publish';
import * as Dates from '../../../helpers/dates';
import Time from '../../time';
import TaskPlanStats from './stats';
import moment from '../../../helpers/moment-range';

export default
@identifiedBy('task-plans/teacher/plan')
class TeacherTaskPlan extends BaseModel {

  @identifier id;
  @field title;
  @field type;

  @field ecosystem_id;
  @field({ type: 'date' }) first_published_at
  @field({ type: 'date' }) last_published_at;
  @session({ type: 'date' }) publish_last_requested_at;
  @field failed_at;
  @field killed_at;
  @field is_draft;
  @field is_preview;
  @field is_published;
  @field is_publishing;
  @field is_trouble;
  @field cloned_from_id;
  @field is_deleting;
  @session publish_job_url;
  @field({ type: 'object' }) settings;
  @hasMany({ model: TaskingPlan }) tasking_plans;

  @computed get isClone() {
    return !!this.cloned_from_id;
  }

  @observable publishingUpdates;

  constructor(attrs) {
    super(attrs);
    this.publishing = createAtom(
      'TaskPlanUpdates',
      () => { TaskPlanPublish.forPlan(this).startListening(); },
      () => { TaskPlanPublish.stopPollingForPlan(this); },
    );

  }

  @lazyInitialize analytics = new TaskPlanStats({ taskPlan: this });

  @computed get isEvent() { return 'event' === this.type; }

  @computed get durationLength() {
    return this.duration.length('days');
  }

  @computed get opensAtDay() {
    const tp = first(sortBy(this.tasking_plans, 'opens_at'));
    return tp ? tp.opensAtDay : null;
  }

  @computed get opensAt() {
    return this.opensAtDay.start().format('M/D');
  }

  @computed get duration() {
    return Dates.getDurationFromMoments(
      map(this.tasking_plans, 'due_at'),
    );
  }

  @computed get dueRange() {
    const due_times = sortBy(map(this.tasking_plans, tp => moment(tp.due_at)), m => m.toDate());
    return moment.range(first(due_times), last(due_times));
  }

  @action onPublishComplete() {
    this.is_published = true;
    this.is_publishing = false;
    this.publish_job_url = null;
  }


  @computed get durationRange() {
    return Dates.getDurationFromMoments(
      union(
        map(this.tasking_plans, 'opens_at'),
        map(this.tasking_plans, 'due_at'),
      )
    );
  }

  // camelcase versions to match existing API
  @computed get isPublished() { return this.is_published; }
  @computed get isPublishing() { return this.is_publishing; }
  @computed get isTrouble() { return this.is_trouble; }
  @computed get isOpen() { return this.durationRange.start().isBefore(Time.now); }
  @computed get isEditable() { return this.durationRange.start().isAfter(Time.now); }
  @computed get isFailed() { return Boolean(this.failed_at || this.killed_at); }
  @computed get isPastDue() { return this.durationRange.end().isBefore(Time.now); }

  @computed get isPollable() {
    return Boolean(
      !this.failed_at &&
        !this.killed_at &&
        this.is_publishing &&
        this.publish_job_url
    );
  }

  isPastDueWithPeriodId() {
    return find(this.tasking_plans, 'isPastDue');
  }

  @computed get publishedStatus() {
    if (this.isPublished) return 'published';
    if (this.is_draft) return 'draft';
    if (this.isPublishing) return 'publishing';
    return 'unknown';
  }

};
