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

  constructor(attrs) {
    super(attrs);
    if (!this.opens_at) {
      this.opens_at = this.defaultOpensAt();
    }
  }

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
      this.target_id && this.target_type && this.opens_at && this.due_at
    );
  }

  @computed get dataForSave() {
    return extend(pick(this, 'target_id', 'target_type'), {
      opens_at: this.course.momentInZone(this.opens_at).format('YYYY-MM-DD HH:mm'),
      due_at: this.course.momentInZone(this.due_at).format('YYYY-MM-DD HH:mm'),
    });
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
      this.course.momentInZone(this.opens_at).hour(hour).minute(minute).startOf('minute'),
    ).toISOString();
  }

  @action setDueDate(date) {
    this.due_at = findLatest(
      moment(this.opens_at).add(1, 'minute'),
      dateWithUnchangedTime(date, this.due_at),
    ).toISOString();
  }

  @action setDueTime(time) {
    const [hour, minute] = time.split(':');
    this.due_at = findLatest(
      moment(this.opens_at).add(1, 'minute'),
      this.course.momentInZone(this.due_at).hour(hour).minute(minute).startOf('minute'),
    ).toISOString();
  }

  @computed get opensAtTime() {
    return this.opens_at ? this.course.momentInZone(this.opens_at).format('HHmm') : '';
  }

  @computed get dueAtTime() {
    return this.due_at ? this.course.momentInZone(this.due_at).format('HHmm') : '';
  }

}
