import {
  BaseModel, identifiedBy, field, session, identifier, hasMany,
} from 'shared/model';
import { action, computed, observable, createAtom, observe } from 'mobx';
import {
  first, last, map, union, find, get, pick, extend, every, isEmpty,
} from 'lodash';
import isUrl from 'validator/lib/isURL';
import { lazyInitialize } from 'core-decorators';
import TaskingPlan from './tasking';
import TaskPlanPublish from '../../jobs/task-plan-publish';
import { findEarliest, findLatest } from '../../../helpers/dates';
import Time from '../../time';
import TaskPlanStats from './stats';
import moment from '../../../helpers/moment-range';
const SELECTION_COUNTS = {
  default: 3,
  max: 4,
  min: 0,
};

export { SELECTION_COUNTS };

const calculateDefaultOpensAt = ({ course }) => {
  const defaultOpensAt = moment(Time.now).add(1, 'day').startOf('minute');
  if (!course) {
    return defaultOpensAt.toISOString();
  }
  const [ hour, minute ] = course.default_open_time.split(':');

  return moment(
    findLatest(
      findEarliest(
        moment(course.bounds.end).subtract(1, 'day'),
        defaultOpensAt,
      ),
      moment(course.bounds.start).add(1, 'day'),
    ),
  ).hour(hour).minute(minute).startOf('minute').toISOString();
};
export { calculateDefaultOpensAt };

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
  @field grading_template_id;
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
  @observable course;

  constructor(attrs) {
    super(attrs);
    this.course = attrs.course;
    this.unmodified_plans = attrs.tasking_plans;
    this.publishing = createAtom(
      'TaskPlanUpdates',
      () => { TaskPlanPublish.forPlan(this).startListening(); },
      () => { TaskPlanPublish.stopPollingForPlan(this); },
    );

    if (this.isNew) {
      if (this.isHomework) {
        this.settings.exercises_count_dynamic = SELECTION_COUNTS.default;
      }
    }
    observe(this, 'grading_template_id', ({ oldValue, newValue }) => {
      const previousTemplate = this.course.gradingTemplates.get(oldValue);
      const currentTemplate = this.course.gradingTemplates.get(newValue);
      this.tasking_plans.forEach(tp => tp.onGradingTemplateUpdate({ previousTemplate, currentTemplate }));
    });

  }

  @computed get gradingTemplate() {
    return this.course.gradingTemplates.get(this.grading_template_id);
  }

  @lazyInitialize analytics = new TaskPlanStats({ taskPlan: this });

  findOrCreateTaskingForPeriod(period, defaultAttrs = {}) {
    const tp = this.tasking_plans.forPeriod(period);
    if (tp) { return tp; }
    this.tasking_plans.push({
      ...defaultAttrs,
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

  @computed get opensAtString() {
    const opens = this.duration.start;

    // it's open
    if (opens.isBefore(Time.now)) {
      return null;
    }
    if (opens.isSame(Time.now, 'day')) {
      return opens.format('h:mm a');
    }
    return opens.format('M/D');
  }

  @computed get duration() {
    return moment.range(
      this.dateRanges.opens.start,
      this.dateRanges.due.end,
    );
  }

  rangeFor(attr) {
    const dates = map(
      this.tasking_plans, tp => moment(tp[attr]).valueOf()
    );
    dates.sort();
    return moment.range(first(dates), last(dates));
  }

  @computed get dateRanges() {
    return {
      opens: this.rangeFor('opens_at'),
      due: this.rangeFor('due_at'),
      closes: this.rangeFor('closes_at'),
    };
  }

  @computed get areTaskingDatesSame() {
    return Boolean(
      0 === this.dateRanges.opens.start.diff(this.dateRanges.opens.end, 'minute') &&
        0 === this.dateRanges.due.start.diff(this.dateRanges.due.end, 'minute') &&
        0 === this.dateRanges.closes.start.diff(this.dateRanges.closes.end, 'minute')
    );
  }

  @action onPublishComplete() {
    this.is_published = true;
    this.is_publishing = false;
    this.publish_job_url = null;
  }

  @action _moveSettings(type, id, step) {
    id = String(id);
    const curIndex = this.settings[type].findIndex(i => i == id);

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
  @computed get isOpen() { return this.duration.start.isBefore(Time.now); }
  @computed get isEditable() {
    // at one time this had date logic, but now
    // teachers are allowed to edit at any time
    return true ;
  }
  @computed get isFailed() { return Boolean(this.failed_at || this.killed_at); }
  @computed get isPastDue() { return this.duration.end.isBefore(Time.now); }
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

  @computed get pageIds() {
    return get(this, 'settings.page_ids', []);
  }

  @computed get exerciseIds() {
    return get(this, 'settings.exercise_ids', []);
  }

  @action addExercise(ex) {
    this.settings.exercise_ids = union(this.exerciseIds, [ex.id]);
  }

  includesExercise(exercise) {
    return Boolean(
      this.isHomework && this.exerciseIds.includes(exercise.id)
    );
  }

  @computed get clonedAttributes() {
    return extend(pick(
      this,
      'title', 'description', 'settings', 'type', 'ecosystem_id', 'is_feedback_immediate',
    ), {
      tasking_plans: map(this.tasking_plans, 'clonedAttributes'),
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
    return extend(
      this.clonedAttributes,
      pick(this, 'is_publish_requested'),
      { tasking_plans: map(this.tasking_plans, 'dataForSave') },
    );
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
    if (isEmpty(this.tasking_plans) || !every(this.tasking_plans, 'isValid')) {
      parts.push('taskings');
    }
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
