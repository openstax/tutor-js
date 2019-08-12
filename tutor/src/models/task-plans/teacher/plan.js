import {
  BaseModel, identifiedBy, field, session, identifier, hasMany,
} from 'shared/model';
import { action, computed, observable, createAtom } from 'mobx';
import {
  sortBy, first, last, map, union, find,
  get, pick, extend, every, isEmpty,
} from 'lodash';
import isUrl from 'validator/lib/isURL';
import { lazyInitialize } from 'core-decorators';
import TaskingPlan from './tasking';
import TaskPlanPublish from '../../jobs/task-plan-publish';
import { getDurationFromMoments } from '../../../helpers/dates';
import Time from '../../time';
import TaskPlanStats from './stats';
import moment from '../../../helpers/moment-range';

const TUTOR_SELECTIONS = {
  default: 3,
  max: 4,
  min: 0,
};


export default
@identifiedBy('task-plans/teacher/plan')
class TeacherTaskPlan extends BaseModel {

  @identifier id;
  @field title = '';
  @field description = '';
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
  @field publish_job_url;
  @field({ type: 'object' }) settings = {};
  @hasMany({ model: TaskingPlan, inverseOf: 'plan', extend: {
    forPeriod(period) { return find(this, { target_id: period.id, target_type: 'period' }); },
    defaults(tasking, plan) {
      return { opens_at: plan.defaultOpensAt };
    },
  } }) tasking_plans;

  @observable unmodified_plans = [];

  // only set when publishing
  @field is_feedback_immediate = false;
  @field is_publish_requested = false;

  @observable publishingUpdates;
  @session({ type: 'object' }) course;

  constructor(attrs) {
    super(attrs);
    this.unmodified_plans = attrs.tasking_plans;
    this.publishing = createAtom(
      'TaskPlanUpdates',
      () => { TaskPlanPublish.forPlan(this).startListening(); },
      () => { TaskPlanPublish.stopPollingForPlan(this); },
    );
    if (this.isNew) {
      if (this.isHomework) {
        this.settings.exercises_count_dynamic = TUTOR_SELECTIONS.default;
      }
    }
  }

  @lazyInitialize analytics = new TaskPlanStats({ taskPlan: this });

  findOrCreateTaskingForPeriod(period) {
    const tp = this.tasking_plans.forPeriod(period);
    if (tp) { return tp; }
    this.tasking_plans.push({
      target_id: period.id, target_type: 'period',
    });
    return this.tasking_plans[this.tasking_plans.length - 1];
  }

  @computed get isClone() {
    return !!this.cloned_from_id;
  }

  @computed get isNew() {
    return Boolean(!this.id || 'new' === this.id);
  }

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
    return getDurationFromMoments(
      map(this.tasking_plans, 'due_at'),
    );
  }

  @computed get dueRange() {
    const due_times = sortBy(map(this.tasking_plans, tp => moment(tp.due_at)), m => m.toDate());
    return moment.range(first(due_times), last(due_times));
  }

  rangeFor(attr) {
    const dates = map(
      this.tasking_plans, tp => moment(tp[attr]).toDate()
    );
    dates.sort();
    return moment.range(first(dates), last(dates));
  }

  @computed get dateRanges() {
    return {
      opens: this.rangeFor('opens_at'),
      due: this.rangeFor('due_at'),
    };
  }

  @computed get areTaskingDatesSame() {
    return Boolean(
      this.dateRanges.opens.start.isSame(
        this.dateRanges.opens.end
      ) && this.dateRanges.due.start.isSame(
        this.dateRanges.due.end
      )
    );
  }

  @action onPublishComplete() {
    this.is_published = true;
    this.is_publishing = false;
    this.publish_job_url = null;
  }

  @computed get durationRange() {
    return getDurationFromMoments(
      union(
        map(this.tasking_plans, 'opens_at'),
        map(this.tasking_plans, 'due_at'),
      )
    );
  }

  @action _moveSettings(type, id, step) {
    id = String(id);
    const curIndex = this.settings[type].indexOf(id);

    if (-1 === curIndex){ return; }
    let newIndex = curIndex + step;
    if (newIndex < 0) {
      newIndex = 0;
    }
    if (!(newIndex < this.settings[type].length)) {
      newIndex = this.settings[type].length - 1;
    }
    this.settings[type][curIndex] = this.settings[type][newIndex];
    this.settings[type][newIndex] = id;
  }

  @action _removeSettings(type, id) {
    const indx = this.settings[type].indexOf(String(id));
    if (-1 !== indx) {
      this.settings[type].splice(indx, 1);
    }
  }

  @action.bound removePage(page) {
    this._removeSettings('page_ids', page.id);
  }

  @action.bound movePage(page, step) {
    this._moveSettings('page_ids', page.id, step);
  }

  @action.bound removeExercise(ex) {
    this._removeSettings('exercise_ids', ex.id);
  }

  @action moveExercise(ex, step) {
    this._moveSettings('exercise_ids', ex.id, step);
  }


  @computed get isEvent() { return 'event' === this.type; }
  @computed get isReading() { return 'reading' === this.type; }
  @computed get isHomework() { return 'homework' === this.type; }
  @computed get isExternal() { return 'external' === this.type; }

  // camelcase versions to match existing API
  @computed get isPublished() { return this.is_published; }
  @computed get isPublishing() { return this.is_publishing; }
  @computed get isTrouble() { return this.is_trouble; }
  @computed get isOpen() { return this.durationRange.start().isBefore(Time.now); }
  @computed get isEditable() {
    return true ; // this.isNew || this.durationRange.start().isAfter(Time.now);
  }
  @computed get isFailed() { return Boolean(this.failed_at || this.killed_at); }
  @computed get isPastDue() { return this.durationRange.end().isBefore(Time.now); }
  @computed get isVisibleToStudents() { return this.isPublished && this.isOpen; }

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

  @action reset() {
    this.title = this.description = '';
    this.tasking_plans = this.course.periods.active.map(period => ({
      target_id: period.id, target_type: 'period',
    }));
  }

  @computed get publishedStatus() {
    if (this.isPublished) return 'published';
    if (this.is_draft) return 'draft';
    if (this.isPublishing) return 'publishing';
    return 'unknown';
  }

  @computed get hasTaskingDatesChanged() {
    return Boolean(
      get(this.unmodified_plans, 'length', 0) != get(this.tasking_plans, 'length', 0) ||
        find(this.unmodified_plans, (a, i) => {
          const b = this.tasking_plans[i];
          return !moment(a.opens_at).isSame(b.opens_at) ||
            !moment(a.due_at).isSame(b.due_at);
        })
    );
  }

  @computed get canEdit() {
    return !this.isVisibleToStudents;
  }

  @computed get numTutorSelections() {
    return get(this, 'settings.exercises_count_dynamic', 0);
  }

  @computed get numExercises() {
    return this.exerciseIds.length;
  }

  @computed get pageIds() {
    return get(this, 'settings.page_ids', []);
  }

  @computed get exerciseIds() {
    return get(this, 'settings.exercise_ids', []);
  }

  @action addExercise(ex) {
    this.settings.exercise_ids = union(this.exerciseIds, [ex.id]);
  }

  @computed get canIncreaseTutorExercises() {
    return this.numTutorSelections < TUTOR_SELECTIONS.max;
  }

  @computed get canDecreaseTutorExercises() {
    return this.numTutorSelections > TUTOR_SELECTIONS.min;
  }

  includesExercise(exercise) {
    return Boolean(
      this.isHomework && this.exerciseIds.includes(exercise.id)
    );
  }

  @computed get clonedAttributes() {
    return extend(pick(
      this,
      'title', 'description', 'settings', 'type', 'ecosystem_id',
    ), {
      tasking_plans: map(this.tasking_plans, 'dataForSave'),
    });
  }

  @action createClone({ course }) {
    return new TeacherTaskPlan({
      ...this.clonedAttributes,
      tasking_plans: course.periods.active.map(period => ({
        target_id: period.id,
        target_type: 'period',
      })),
      course,
    });
  }

  @computed get dataForSave() {
    return extend(this.clonedAttributes, pick(this, 'is_publish_requested'));
  }

  @computed get isExternalUrlValid() {
    return Boolean(
      !this.isExternal ||
        (!isEmpty(this.settings.external_url) &&
         isUrl(this.settings.external_url))
    );
  }

  @computed get invalidParts() {
    const parts = [];
    if (!String(this.title).match(/\w/)) { parts.push('title'); }
    if (!every(this.tasking_plans, 'isValid')) { parts.push('taskings'); }
    if (this.isReading && isEmpty(this.pageIds)) { parts.push('readings'); }
    if (this.isHomework && isEmpty(this.exerciseIds)) { parts.push('homeworks'); }
    if (!this.isExternalUrlValid){ parts.push('external_url'); }

    return parts;
  }

  @computed get isValid() {
    return 0 === this.invalidParts.length;
  }

  // called from api
  save() {
    const options = this.isNew ? {
      url: `courses/${this.course.id}/plans`,
      method: 'POST',
    } : {
      url: `plans/${this.id}`,
    };
    options.data = this.dataForSave;
    return options;
  }

  // called from api
  onApiRequestComplete({ data }) {
    this.api.errors = {};
    this.update(data);
    this.unmodified_plans = data.tasking_plans;
  }

  fetch() { return this; }

  destroy() {
    this.is_deleting = true;
    return this;
  }

  @action onDeleteComplete() {
    this.is_deleting = false;
    this.course.teacherTaskPlans.delete(this.id);
  }
}
