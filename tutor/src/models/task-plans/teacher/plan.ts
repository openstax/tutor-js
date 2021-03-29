import {
  BaseModel,
  field,
  action,
  computed,
  observable,
  createAtom,
  toJS,
  model,
  modelize,
  NEW_ID,
} from 'shared/model';
import DateTime from 'shared/model/date-time';
import Exercises from '../../exercises';
import {
    first, last, map, flatMap, find, get, pick, extend, every, isEmpty,
    compact, findIndex, filter, includes, uniq, omit, unionBy,
} from 'lodash';
import isUrl from 'validator/lib/isURL';
import { lazyInitialize } from 'core-decorators';
import TaskingPlan from './tasking';
import TaskPlanPublish from '../../jobs/task-plan-publish';
import { findEarliest, findLatest } from '../../../helpers/dates';
import Time from '../../time';
import TaskPlanStats from './stats';
import DroppedQuestion from './dropped_question';
import moment from '../../../helpers/moment-range';
import TaskPlanScores from './scores';

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


class QuestionInfo {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}


export default class TeacherTaskPlan extends BaseModel {

  @field id = NEW_ID;
  @field title = '';
  @field description = '';
  @field type;

  @field ecosystem_id;
  @model(DateTime) first_published_at?: DateTime;
  @model(DateTime) last_published_at?: DateTime;
  @model(DateTime) publish_last_requested_at?: DateTime;
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
  @field ungraded_step_count;
  @field gradable_step_count;
  @field wrq_count;
  @field extensions?: any; // null by default
  @field settings?: any = {};

  @model(DroppedQuestion) dropped_questions = [];

  @model(TaskingPlan) tasking_plans = []; /* extend: {
      forPeriod(period) { return find(this, { target_id: period.id, target_type: 'period' }); },
      defaults(tasking, plan) { return { opens_at: plan.defaultOpensAt }; },
      areValid() { return Boolean(this.length > 0 && every(this, 'isValid')); },
  } */

  @observable unmodified_plans = [];

  // only set when publishing
  @field is_feedback_immediate = false;
  @field is_publish_requested = false;

  @observable publishingUpdates;
  @observable course;

  constructor(attrs) {
      super(attrs);
      modelize(this);
      this.course = attrs.course;
      this.cloned_from_id = attrs.cloned_from_id;
      this.unmodified_plans = attrs.tasking_plans;
      this.exercisesMap = attrs.exercisesMap || Exercises;
      this.publishing = createAtom(
          'TaskPlanUpdates',
          () => { TaskPlanPublish.forPlan(this).startListening(); },
          () => { TaskPlanPublish.stopPollingForPlan(this); },
      );
      if (this.isNew && !this.isClone) {
          Object.assign(this.settings, this.defaultSettings);
      }
  }

  @computed get defaultSettings() {
      if (this.isHomework) {
          return {
              exercises: [],
              exercises_count_dynamic: SELECTION_COUNTS.default,
          };
      }
      if (this.isReading) {
          return {
              page_ids: [],
          };
      }
      if (this.isExternal) {
          return { external_url: '' };
      }
      return {};
  }

  @computed get gradingTemplate() {
      return this.course.gradingTemplates.get(this.grading_template_id);
  }

  @lazyInitialize scores = new TaskPlanScores({ taskPlan: this, id: this.id });
  @lazyInitialize analytics = new TaskPlanStats({ taskPlan: this });

  findOrCreateTaskingForPeriod(period, defaultAttrs = {}) {
      let tp = this.tasking_plans.forPeriod(period);
      if (tp) { return tp; }


      this.tasking_plans.push({
          ...defaultAttrs,
          target_id: period.id, target_type: 'period',
      });
      tp = this.tasking_plans[this.tasking_plans.length - 1];
      if (this.gradingTemplate) {
          tp.onGradingTemplateUpdate(this.gradingTemplate, defaultAttrs.dueAt);
      }

      return tp;
  }

  @computed get isClone() {
      return !!this.cloned_from_id;
  }

  @computed get isNew() {
      return Boolean(!this.id || 'new' === this.id);
  }

  @computed get canGrade() {
      return Boolean(this.isHomework && this.ungraded_step_count > 0);
  }

  @computed get canGrantExtension() {
      return Boolean(this.isHomework || this.isReading);
  }

  @computed get opensAtString() {
      const opens = this.course.momentInZone(this.duration.start);

      // it's open
      if (opens.isBefore(Time.now)) {
          return null;
      }
      if (opens.isSame(Time.now, 'day')) {
          return opens.format('h:mm a z');
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

  get dateRanges() {
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

  @action _moveSettings(type, match, step) {
      const curIndex = findIndex(this.settings[type], match);
      if (-1 === curIndex){ return; }

      let newIndex = curIndex + step;
      if (newIndex < 0) {
          newIndex = 0;
      }
      if (!(newIndex < this.settings[type].length)) {
          newIndex = this.settings[type].length - 1;
      }
      const value = this.settings[type][curIndex];
      this.settings[type][curIndex] = this.settings[type][newIndex];
      this.settings[type][newIndex] = value;
  }

  @action _removeSettings(type, match) {
      const indx = findIndex(this.settings[type], match);
      if (-1 !== indx) {
          this.settings[type].splice(indx, 1);
      }
  }

  @action.bound removePage(page) {
      this._removeSettings('page_ids', n => n == page.id);
  }

  @action.bound movePage(page, step) {
      this._moveSettings('page_ids', n => n == page.id, step);
  }

  @action.bound removeExercise(ex) {
      this._removeSettings('exercises', { id: ex.id });
  }

  @action moveExercise(ex, step) {
      this._moveSettings('exercises', { id: ex.id }, step);
  }


  @computed get isEvent() { return 'event' === this.type; }
  @computed get isReading() { return 'reading' === this.type; }
  @computed get isHomework() { return 'homework' === this.type; }
  @computed get isExternal() { return 'external' === this.type; }
  @computed get isPractice() {
      return includes(['practice_worst_topics', 'page_practice', 'practice_saved'], this.type);
  }

  // camelcase versions to match existing API
  @computed get isPublished() { return this.is_published; }
  @computed get isPublishing() { return this.is_publishing; }
  @computed get isTrouble() { return this.is_trouble; }
  @computed get isOpen() {
      return Boolean(
          this.isPublished && this.tasking_plans.length && this.duration.start.isBefore(Time.now),
      );
  }
  @computed get isEditable() {
      // at one time this had date logic, but now
      // teachers are allowed to edit at any time
      return true ;
  }
  @computed get isFailed() { return Boolean(this.failed_at || this.killed_at); }
  @computed get isPastDue() { return this.duration.end.isBefore(Time.now); }
  @computed get isGradeable() { return this.dateRanges.due.start.isBefore(Time.now); }
  @computed get isVisibleToStudents() { return this.isPublished && this.isOpen; }

  @computed get isPollable() {
      return Boolean(
          !this.failed_at &&
        !this.killed_at &&
        this.is_publishing &&
        this.publish_job_url
      );
  }


  @computed get exerciseIds() {
      return uniq(map(this.settings.exercises, 'id'));
  }

  @computed get exercises() {
      return compact(this.exerciseIds.map(exId => this.exercisesMap.get(exId)));
  }

  @computed get isEveryExerciseMultiChoice() {
      return this.exercises.length && every(this.exercises, 'isMultiChoice');
  }

  @computed get questionsInfo() {
      return flatMap(this.exercises, (exercise, exerciseIndex) => (
          exercise.content.questions.map((question, questionIndex) => {
              const points = this.settings.exercises[exerciseIndex].points[questionIndex];
              return new QuestionInfo({
                  key: `${exerciseIndex}-${questionIndex}`,
                  question, exercise, exerciseIndex, questionIndex, plan: this,
                  availablePoints: points,
                  points,
              });
          })
      ));
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

  @computed get assignedSections() {
      return compact(this.pageIds.map(pgId => this.course.referenceBook.pages.byId.get(pgId)));
  }

  @action addExercise(ex) {
      if (!this.exerciseIds.find(exId => exId == ex.id)) {
          this.settings.exercises.push({
              id: ex.id,
              points: map(ex.content.questions, question => question.isOpenEnded ? 2.0 : 1.0),
          });
      }
  }

  includesExercise(exercise) {
      return Boolean(
          this.isHomework && this.exerciseIds.includes(exercise.id)
      );
  }

  @computed get clonedAttributes() {
      return extend(pick(
          this,
          'description', 'settings', 'title', 'type', 'ecosystem_id', 'is_feedback_immediate', 'grading_template_id'
      ), {
          tasking_plans: map(this.tasking_plans, 'clonedAttributes'),
      });
  }

  @action createClone({ course }) {
      return new TeacherTaskPlan({
          ...this.clonedAttributes,
          course,
          cloned_from_id: this.id,
          tasking_plans: course.periods.active.map(period => ({
              target_id: period.id,
              target_type: 'period',
          })),
      });
  }

  @computed get dataForSave() {
      let data = extend(
          this.clonedAttributes,
          pick(this, 'is_publish_requested', 'cloned_from_id'),
          { tasking_plans: map(this.tasking_plans, 'dataForSave') },
      );
      if (!this.canEdit) {
          data = omit(data, 'settings');
      }
      return data;
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

  @action saveDroppedQuestions() {
      return {
          data: {
              dropped_questions: toJS(this.dropped_questions),
          },
      };
  }

  @computed get activeAssignedPeriods() {
      const ids = compact(this.tasking_plans.map(tp => tp.target_type == 'period' && tp.target_id));
      return filter(
          this.course.periods.sorted, p => includes(ids, p.id)
      );
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

  grantExtensions(extensions) {
      //if new extensions dates are selected for a student who has already an extension, this will update the student previous extended dates
      const grantedExtensions = unionBy(extensions, this.extensions, 'role_id');
      return {
          id: this.id,
          data: {
              extensions: grantedExtensions,
          },
      };
  }

  // called from api
  onApiRequestComplete({ data }) {
      this.api.errors = {};
      this.update(data);
      this.is_publish_requested = false;
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

  isValidCloseDate(taskings, date) {
      if (date.isAfter(this.course.ends_at)) {
          return true;
      }
      return !!taskings.find(tasking => {
          return date.isBefore(tasking.due_at);
      });
  }

}
