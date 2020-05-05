import {
  BaseModel, identifiedBy, field, action, session, computed,
} from 'shared/model';
import { pick, get, extend, find } from 'lodash';
import moment from 'moment';
import Time from '../../time';
import {
  findEarliest, findLatest, dateWithUnchangedTime,
} from '../../../helpers/dates';

export default
@identifiedBy('tasking-plan')
class TaskingPlan extends BaseModel {

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

  get course() {
    return get(this.plan, 'course');
  }

  get period() {
    if (this.target_type !== 'period') { return null; }
    return this.course.periods.find(p => p.id == this.target_id);
  }

  opensAtForTemplate(template) {
    const [ hour, minute ] = template.default_open_time.split(':');
    const defaultOpensAt = moment(Time.now).add(1, 'day').hour(hour).minute(minute).startOf('minute');
    const { course } = this;
    if (!course) {
      return defaultOpensAt.toISOString();
    }

    return moment(
      findLatest(
        findLatest(
          course.bounds.start,
          defaultOpensAt,
        ),
        course.bounds.start.add(1, 'minute'),
      ),
    ).hour(hour).minute(minute).startOf('minute').toISOString();
  }

  dueAtForTemplate(template) {
    const dueDateOffsetDays = template.default_due_date_offset_days;
    const [ hour, minute ] = template.default_due_time.split(':');
    const defaultDueAt = moment(this.opens_at).add(dueDateOffsetDays, 'days');
    const { course } = this;
    if (!course) {
      return defaultDueAt.toISOString();
    }
    return findEarliest(
      defaultDueAt,
      course.bounds.end,
    ).hour(hour).minute(minute).startOf('minute').toISOString();
  }

  closesAtForTemplate(template) {
    const closeDateOffsetDays = template.default_close_date_offset_days;
    return moment(this.dueAtForTemplate(template)).add(closeDateOffsetDays, 'days').toISOString();
  }

  @action onGradingTemplateUpdate({ previousTemplate, currentTemplate }) {
    if (!this.opens_at || !previousTemplate || this.opens_at === this.opensAtForTemplate(previousTemplate) ) {
      this.opens_at = this.opensAtForTemplate(currentTemplate);
    }
    if(!this.due_at || !previousTemplate || this.due_at === this.dueAtForTemplate(previousTemplate)) {
      this.due_at = this.dueAtForTemplate(currentTemplate);
    }
    if(!this.closes_at || !previousTemplate || this.closes_at === this.closesAtForTemplate(previousTemplate)) {
      this.closes_at = this.closesAtForTemplate(currentTemplate);
    }
  }

  @computed get isPastDue() {
    return moment(this.due_at).isBefore(Time.now);
  }

  @computed get isValid() {
    return Boolean(
      this.target_id &&
        this.target_type &&
        this.opens_at &&
        this.due_at &&
        moment(this.due_at).isAfter(Time.now)
    );
  }

  @computed get isUsingDefaultOpensAt() {
    const [ hour, minute ] = this.course.default_open_time.split(':');
    const opensAt = this.opensAtMoment;
    return Boolean(opensAt.hour() == hour && opensAt.minute() == minute);
  }

  @computed get isUsingDefaultDueAt() {
    const [ hour, minute ] = this.course.default_due_time.split(':');
    if (!this.due_at) { return true; }
    const dueAt = this.dueAtMoment;
    return Boolean(dueAt.hour() == hour && dueAt.minute() == minute);
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

    const nearFuture = moment(Time.now).add(30, 'minute');
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
    this.opens_at = findEarliest(
      moment(this.due_at).subtract(1, 'minute'),
      dateWithUnchangedTime(date, this.opens_at),
    ).toISOString();
  }

  @action setOpensTime(time) {
    const [hour, minute] = time.split(':');
    this.opens_at = findEarliest(
      moment(this.due_at).subtract(1, 'minute'),
      this.opensAtMoment.hour(hour).minute(minute).startOf('minute')
    ).toISOString();
  }

  @action setDueDate(date) {
    this.due_at = findLatest(
      moment(this.opens_at).add(1, 'minute'),
      date,
    ).toISOString();
  }

  @action setDueTime(time) {
    const [hour, minute] = time.split(':');
    if (!this.due_at) {
      // this will be overwritten, but needs to be set
      // so the time doesn't default to today
      this.due_at = moment(Time.now).add(1, 'day');
    }
    this.due_at = findLatest(
      moment(this.opens_at).add(1, 'minute'),
      this.dueAtMoment.hour(hour).minute(minute).startOf('minute'),
    ).toISOString();
  }

  @action setClosesDate(date) {
    this.closes_at = findLatest(
      moment(this.due_at).add(1, 'minute'),
      date,
    ).toISOString();
  }

  @computed get opensAtTime() {
    const { course } = this;
    const m = this.opens_at ? this.opensAtMoment : moment(course.default_open_time, 'HH:mm');
    return m.format('HH:mm');
  }

  @computed get defaultDueTime() {
    return moment(this.course.default_due_time, 'HH:mm');
  }

  @computed get dueAtTime() {
    const m = this.due_at ? this.dueAtMoment : this.defaultDueTime;
    return m.format('HH:mm');
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
