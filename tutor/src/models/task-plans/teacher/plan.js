import {
  BaseModel, identifiedBy, field, session, identifier, hasMany,
} from 'shared/model';
import { action, computed, observable, createAtom } from 'mobx';
import {
  sortBy, first, last, map, union, find, get, pick, extend, without,
} from 'lodash';
import { lazyInitialize } from 'core-decorators';
import TaskingPlan from './tasking'
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
  @session publish_job_url;
  @field({ type: 'object' }) settings;
  @hasMany({ model: TaskingPlan, inverseOf: 'plan' }) tasking_plans;

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
  }

  @lazyInitialize analytics = new TaskPlanStats({ taskPlan: this });

  findOrCreateTaskingForPeriod(period) {
    const tp = find(this.tasking_plans, {
      target_id: period.id, target_type: 'period',
    });
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
  @computed get isVisibleToStudents() { return this.isPublishing && this.isOpen; }

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

  @computed get exerciseIds() {
    return get(this, 'settings.exercise_ids', []);
  }

  @action removeExercise(ex) {
    this.settings.exercise_ids = without(this.exerciseIds, ex.id);
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

  @computed get dataForSave() {
    return extend(pick(this,
      'title', 'description', 'settings',
      'is_publish_requested',
    ), {
      tasking_plans: map(this.tasking_plans, 'dataForSave'),
    });
  }

  // called from api
  save() {
    const options = this.isNew ? {
      url: `courses/${this.course.id}/plans`,
      method: 'POST',
    } : {
      url: `plans/${this.id}`,
    };
    if (this.ecosystem_id) {
      options.params = { ecosystem_id: this.ecosystem_id };
    }
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

}
