import {
  computed, action,
} from 'mobx'

import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from '../base';
import { TimeStore } from '../../flux/time';
import moment from 'moment';
import Payments from '../payments';
@identifiedBy('course/student')
export default class CourseStudent extends BaseModel {
  @identifier id;

  @field name;
  @field uuid;
  @field first_name;
  @field last_name;
  @field is_active;
  @field is_comped;
  @field is_paid;
  @field is_refund_allowed;
  @field is_refund_pending;
  @field({ type: 'date' }) payment_due_at;
  @field prompt_student_to_pay;

  @field period_id;
  @field role_id;
  @field student_identifier;

  @belongsTo course;

  // called by api
  save() {
    return {
      courseId: this.course.id, data: this.serialize(),
    };
  }

  get mustPayImmediately() {
    return Boolean(this.needsPayment && moment(this.payment_due_at).isBefore(TimeStore.getNow()));
  }

  get trialDaysRemaining() {
    return moment(this.payment_due_at).diff(TimeStore.getNow(), 'days');
  }

  onSaved({ data }) {
    this.update(data);
  }

  // corresponds to how the BE sets the "prompt_student_to_pay" flag
  // We calculate it ourself so that it can change when payments is enabled/disabled
  // https://github.com/openstax/tutor-server/blob/master/app/representers/api/v1/student_representer.rb#L68-L84
  @computed get needsPayment() {
    return Boolean(
      Payments.config.is_enabled && this.isUnPaid
    );
  }

  @computed get isUnPaid() {
    return Boolean(
      this.course.does_cost &&
      !this.course.is_preview &&
      !this.is_paid &&
      !this.is_comped
    );
  }

  @action markPaid() {
    this.is_paid = true;
    this.prompt_student_to_pay = false;
  }
}
