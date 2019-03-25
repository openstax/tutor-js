import {
  BaseModel, identifiedBy, field,
} from 'shared/model';
import { computed } from 'mobx';
import moment from 'moment';
import Time from '../../time';

export default
@identifiedBy('tasking-plan')
class TaskingPlan extends BaseModel {

  @field target_id;
  @field target_type;

  // Note: These are deliberatly NOT set to {type: 'date'}
  // doing so causes strings in YYYY-MM-DD format to be converted to a date
  // that's in the user's timezone.  The date is later coverted to UTC causing
  // it to possibily refer to a different day.
  // To work around this the model makes no assumptions about the format of the "date" it's holding
  @field opens_at;
  @field due_at;

  @computed get opensAtDay() {
    return moment(this.opens_at)
      .startOf('day')
      .twix(moment(this.opens_at).endOf('day'), { allDay: true });
  }

  @computed get isPastDue() {
    return moment(this.due_at).isBefore(Time.now);
  }

};
