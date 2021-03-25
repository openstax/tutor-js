import {
    BaseModel, identifiedBy, field, action, session, computed,
} from 'shared/model';
import { pick, get, extend, find } from 'lodash';
import moment from 'moment';
import Time from '../../time';
import Toasts from '../../toasts';

@identifiedBy('tasking-plan')
export default class TaskingPlan extends BaseModel {

  @field id;
  @field target_id;
  @field target_type;
  @session({ type: 'object' }) plan;

  // Note: These are deliberatly NOT set to {type: 'date'}
  // doing so causes strings in YYYY-MM-DD format to be converted to a date
  // that's in the user's timezone.  The date is later coverted to UTC causing
  // it to possibily refer to a different day.
  // To work around this the model makes no assumptions about the format of the "date" it's holding
  @field opens_at;
  @field due_at;
  @field closes_at;

  constructor(attrs) {
      super(attrs);
      this.originalDueAt = this.due_at;
  }

  get course() {
      return get(this.plan, 'course');
  }

  get period() {
      if (this.target_type !== 'period') { return null; }
      return this.course.periods.find(p => p.id == this.target_id);
  }

  limitDateToCourse(date) {
      if (date.isAfter(this.course.allowedAssignmentDateRange.end)) {
          return this.course.allowedAssignmentDateRange.end;
      }
      if (date.isBefore(this.course.allowedAssignmentDateRange.start)) {
          return this.course.allowedAssignmentDateRange.start;
      }
      return date;
  }

  @action onGradingTemplateUpdate(template, dueAt, options = {}) {
      const dueDateOffsetDays = template.default_due_date_offset_days;
      const closeDateOffsetDays = template.default_close_date_offset_days;
      const [ defaultOpenHour, defaultOpenMinute ] = template.default_open_time.split(':');
      const [ defaultDueHour, defaultDueMinute ] = template.default_due_time.split(':');

      let defaultOpensAt;
      if (dueAt) {
          defaultOpensAt = this.course.momentInZone(dueAt).subtract(dueDateOffsetDays, 'days');
      } else if (this.opens_at) {
          defaultOpensAt = this.course.momentInZone(this.opens_at);
      } else {
          defaultOpensAt = this.course.momentInZone(Time.now).add(1, 'days');
      }
      this.opens_at = this.limitDateToCourse(defaultOpensAt)
          .hour(defaultOpenHour).minute(defaultOpenMinute).startOf('minute').toISOString();

      let defaultDueAt;
      if (dueAt) {
          defaultDueAt = this.course.momentInZone(dueAt);
      } else {
          defaultDueAt = this.course.momentInZone(defaultOpensAt).add(dueDateOffsetDays, 'days');
      }

      dueAt = this.limitDateToCourse(defaultDueAt);
      if (!options.dateWasManuallySet) {
          dueAt = dueAt.hour(defaultDueHour).minute(defaultDueMinute).startOf('minute');
      }
      this.due_at = dueAt.toISOString();

      this.closes_at = this.limitDateToCourse(
          moment(defaultDueAt).add(closeDateOffsetDays, 'days')
      ).toISOString();
  }

  @action publishScores() {}
  @action onPublishScoresComplete() {
      Toasts.push({ handler: 'scoresPublished' });
  }

  @computed get isPastDue() {
      return moment(this.due_at).isBefore(Time.now);
  }

  @computed get isPastOpen() {
      return moment(this.opens_at).isBefore(Time.now);
  }

  @computed get isBeforeDue() {
      return moment(this.due_at).isAfter(Time.now);
  }

  @computed get isDueAfterOpen() {
      return moment(this.due_at).isAfter(this.opens_at);
  }

  @computed get isCloseAfterDue() {
      return moment(this.closes_at).isAfter(this.due_at);
  }

  @computed get isValid() {
      let isValid = this.target_id && this.target_type && this.opens_at && this.due_at && this.isDueAfterOpen;

      if(this.isNew || this.dueAtChanged) {
          isValid = isValid && this.isBeforeDue;
      }
      //event does not have a close date (visually)
      if(!this.plan.isEvent) {
          isValid = isValid && this.isCloseAfterDue;
      }

      return isValid;
  }

  @computed get dueAtChanged() {
      return !moment(this.originalDueAt).isSame(this.due_at);
  }

  @action async persistTime(type) {
      const { course } = this;
      if (type == 'opens') {
          course.default_open_time = this.opensAtMoment.format('HH:mm');
      }
      if (type == 'due') {
          course.default_due_time = this.dueAtMoment.format('HH:mm');
      }
      await course.save();
  }

  @computed get clonedAttributes() {
      return pick(this, 'target_id', 'target_type', 'opens_at', 'due_at', 'closes_at');
  }

  @computed get dataForSave() {
      return extend(pick(this, 'target_id', 'target_type'), {
          opens_at: this.opensAtMoment.format('YYYY-MM-DD HH:mm'),
          due_at: this.dueAtMoment.format('YYYY-MM-DD HH:mm'),
          closes_at: this.closesAtMoment.format('YYYY-MM-DD HH:mm'),
      });
  }

  @computed get unmodified() {
      return find(this.plan.unmodified_plans, {
          target_type: this.target_type, target_id: this.target_id,
      });
  }

  @computed get canEditOpensAt() {
      return Boolean(
          !this.plan.isPublished ||
        !this.unmodified ||
        moment(this.unmodified.opens_at).isAfter(Time.now),
      );
  }

  // resets the due at time to course default
  // and sets opens at date to match the give due at
  initializeWithDueAt({ dueAt, defaultOpenTime, defaultDueTime }) {
      dueAt = this.course.momentInZone(dueAt);
      if(!dueAt.isValid()) { return; }

      let [ hour, minute ] = defaultDueTime.split(':');
      dueAt = dueAt.hour(hour).minute(minute).startOf('minute');

      const nearFuture = this.course.momentInZone(Time.now).add(30, 'minute');
      if (dueAt.isBefore(nearFuture)) {
          dueAt = nearFuture;
      }
      this.due_at = dueAt.toISOString();

      // is requested due at before opens?
      if (dueAt.isBefore(this.opens_at)) {
          [ hour, minute ] = defaultOpenTime.split(':');
          const opens_at = this.course.momentInZone(Time.now).hour(hour).minute(minute).startOf('minute');

          if (dueAt.isSameOrBefore(opens_at)) {
              // set opens_at to just before due
              this.opens_at = dueAt.clone().subtract(1, 'minute').toISOString();
          } else {
              this.opens_at = opens_at.toISOString();
          }
      }
  }

  @action setOpensDate(date) {
      this.opens_at = date.toISOString();
  }

  @action setDueDate(date) {
      this.due_at = date.toISOString();
      if (this.plan.isEvent) { // closes_at === due_at for events
          this.closes_at = this.due_at;
      }
  }

  @action setClosesDate(date) {
      this.closes_at = date.toISOString();
  }

  // note: these are not @computed so that a new moment is
  // returned on each access and can be mutated
  get opensAtMoment() {
      return this.course.momentInZone(this.opens_at);
  }
  get dueAtMoment() {
      return this.course.momentInZone(this.due_at);
  }
  get closesAtMoment() {
      return this.course.momentInZone(this.closes_at);
  }

}