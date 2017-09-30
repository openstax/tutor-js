import {
  BaseModel, identifiedBy, field, session, identifier, hasMany,
} from './base';
import { action, computed, observable, Atom } from 'mobx';
import { sortBy, first, map, union } from 'lodash';
import TaskingPlan from './tasking-plan';
import TaskPlanPublish from './jobs/task-plan-publish';
import * as Dates from '../helpers/dates';
import { TimeStore } from '../flux/time';


@identifiedBy('teacher-task-plan')
export default class TeacherTaskPlan extends BaseModel {

  @identifier id;
  @field title;
  @field type;

  @field ecosystem_id;
  @field({ type: 'date' }) first_published_at
  @field({ type: 'date' }) last_published_at;
  @session({ type: 'date' }) publish_last_requested_at;

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
    this.publishing = new Atom(
      'TaskPlanUpdates',
      () => { this.updateListener = TaskPlanPublish.forPlan(this); },
      () => this.updateListener.stopListening(),
    );

  }

  @computed get durationLength() {
    return this.duration.length('days');
  }

  @computed get opensAtDay() {
    const tp = first(sortBy(this.tasking_plans, 'opens_at'));
    return tp ? tp.opensAtDay : null;
  }

  @computed get duration() {
    return Dates.getDurationFromMoments(
      map(this.tasking_plans, 'due_at'),
    );
  }

  @action onPublishComplete() {
    this.is_published = true;
    this.is_publishing = false;
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
  @computed get isOpen() { return this.durationRange.start().isBefore(TimeStore.getNow()); }
  @computed get isEditable() { return this.durationRange.start().isAfter(TimeStore.getNow()); }
  @computed get isFailed() { return this.publishingUpdates && this.publishingUpdates.hasFailed(); }

  @computed get publishedStatus() {
    if (this.isPublished) return 'published';
    if (this.is_draft) return 'draft';
    if (this.isPublishing) return 'publishing';
    return 'unknown';
  }

}
