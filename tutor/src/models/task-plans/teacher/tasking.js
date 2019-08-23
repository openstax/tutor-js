import {
  BaseModel, identifiedBy, field, action, session, computed,
} from 'shared/model';
import { pick, get, extend } from 'lodash';
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

  get course() {
    return get(this.plan, 'course');
  }

  defaultOpensAt() {
    const defaultOpensAt = moment(Time.now).add(1, 'day').startOf('minute');
    const { course } = this;
    if (!course) {
      return defaultOpensAt.toISOString();
    }
    const [ hour, minute ] = course.default_open_time.split(':');

    return moment(
      findLatest(
        findEarliest(
          course.bounds.end,
          defaultOpensAt,
        ),
        course.bounds.start.add(1, 'minute'),
      ),
    ).hour(hour).minute(minute).startOf('minute').toISOString();
  }

  @computed get opensAtDay() {
    return moment(this.opens_at)
      .startOf('day')
      .twix(moment(this.opens_at).endOf('day'), { allDay: true });
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
    const opensAt = this.course.momentInZone(this.opens_at);
    return Boolean(opensAt.hour() == hour && opensAt.minute() == minute);
  }

  @computed get isUsingDefaultDueAt() {
    const [ hour, minute ] = this.course.default_due_time.split(':');
    if (!this.due_at) { return true; }
    const dueAt = this.course.momentInZone(this.due_at);
    return Boolean(dueAt.hour() == hour && dueAt.minute() == minute);
  }

  @action async persistTime(type) {
    const { course } = this;
    if (type == 'opens') {
      course.default_open_time = course.momentInZone(this.opens_at).format('HH:mm');
    }
    if (type == 'due') {
      course.default_due_time = course.momentInZone(this.due_at).format('HH:mm');
    }
    await course.save();
  }

  @computed get dataForSave() {
    return extend(pick(this, 'target_id', 'target_type'), {
      opens_at: this.course.momentInZone(this.opens_at).format('YYYY-MM-DD HH:mm'),
      due_at: this.course.momentInZone(this.due_at).format('YYYY-MM-DD HH:mm'),
    });
  }

  // resets the due at time to course default
  // and sets opens at date to match the give due at
  initializeWithDueAt(dueAt) {
    dueAt = this.course.momentInZone(dueAt);
    if(!dueAt.isValid()) { return; }

    let [ hour, minute ] = this.course.default_due_time.split(':');
    dueAt = dueAt.hour(hour).minute(minute).startOf('minute');
    const nearFuture = moment(Time.now).add(30, 'minute');
    if (dueAt.isBefore(nearFuture)) {
      dueAt = nearFuture;
    }
    this.due_at = dueAt.toISOString();

    // is requested due at before opens?
    if (dueAt.isBefore(this.opens_at)) {
      [ hour, minute ] = this.course.default_open_time.split(':');
      const opens_at = this.course.momentInZone(Time.now).hour(hour).minute(minute).startOf('minute');

      if (dueAt.isBefore(opens_at)) {
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
      this.course.momentInZone(this.opens_at).hour(hour).minute(minute).startOf('minute')
    ).toISOString();
  }

  @action setDueDate(date) {
    this.due_at = findLatest(
      moment(this.opens_at).add(1, 'minute'),
      dateWithUnchangedTime(date, this.due_at || this.defaultDueTime),
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
      this.course.momentInZone(this.due_at).hour(hour).minute(minute).startOf('minute'),
    ).toISOString();
  }

  @computed get opensAtTime() {
    const { course } = this;
    const m = this.opens_at ? course.momentInZone(this.opens_at) : moment(course.default_open_time, 'HH:mm');
    return m.format('HH:mm');
  }

  @computed get defaultDueTime() {
    return moment(this.course.default_due_time, 'HH:mm');
  }

  @computed get dueAtTime() {
    const m = this.due_at ? this.course.momentInZone(this.due_at) : this.defaultDueTime;
    return m.format('HH:mm');
  }

}
