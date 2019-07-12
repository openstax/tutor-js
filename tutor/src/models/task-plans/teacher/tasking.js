import {
  BaseModel, identifiedBy, field, action, session,
} from 'shared/model';
import { pick } from 'lodash';
import { computed } from 'mobx';
import moment from 'moment';
import Time from '../../time';
import { dateWithUnchangedTime } from '../../../helpers/dates';

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

    if (this.plan && this.plan.course) {
      const [ hour, minute ] = this.plan.course.default_open_time.split(':');
      this.opens_at = moment(Time.now).add(1, 'day')
        .hour(hour).minute(minute).toISOString();
    }

  }

  @computed get opensAtDay() {
    return moment(this.opens_at)
      .startOf('day')
      .twix(moment(this.opens_at).endOf('day'), { allDay: true });
  }

  @computed get isPastDue() {
    return moment(this.due_at).isBefore(Time.now);
  }

  @action setOpensDate(date) {
    this.opens_at = dateWithUnchangedTime(date, this.opens_at);
  }

  @computed get isValid() {
    return Boolean(
      this.target_id && this.target_type && this.opens_at && this.due_at
    );
  }

  @action setOpensTime(time) {
    const [hour, minute] = time.split(':');
    this.opens_at = moment(this.opens_at)
      .hour(hour).minute(minute).seconds(0).millisecond(0)
      .toISOString();
  }

  @computed get dataForSave() {
    return pick(this, 'target_id', 'target_type', 'opens_at', 'due_at');
  }

  @action setDueDate(date) {
    this.due_at = dateWithUnchangedTime(date, this.due_at);
  }

  @action setDueTime(time) {
    const [hour, minute] = time.split(':');
    this.due_at = moment(this.due_at)
      .hour(hour).minute(minute).seconds(0).millisecond(0)
      .toISOString();
  }

}
