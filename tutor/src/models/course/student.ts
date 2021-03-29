import type Course from '../course'
import { readonly } from 'core-decorators';
import {
  BaseModel,
  model,
  field,
  modelize,
  NEW_ID,
  lazyGetter,
  getParentOf,
  computed,
  action,
} from 'shared/model';
import DateTime from 'shared/model/date-time'
import moment from 'moment';
import { pick } from 'lodash';
import Payments from '../payments';

export default class CourseStudent extends BaseModel {
    @readonly static TEACHER_AS_STUDENT_ID = -9;

    @field id = NEW_ID;
    @field name = '';
    @field uuid = '';
    @field first_name = '';
    @field last_name = '';
    @field is_active = false;
    @field is_comped = false;
    @field is_paid = false;
    @field is_refund_allowed = false;
    @field is_refund_pending = false;
    @model(DateTime) payment_due_at = DateTime.unknown;
    @field prompt_student_to_pay = false;

    @field period_id = NEW_ID;
    @field role_id = NEW_ID;
    @field student_identifier = '';

    get course() { return getParentOf(this) as Course }

    constructor() {
        super();
        modelize(this);
    }

    get mustPayImmediately() {
        return Boolean(this.needsPayment && this.payment_due_at.isInPast);
    }

    get trialTimeRemaining() {
        return moment.duration(moment().diff(moment(this.payment_due_at.asDate))).humanize();
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
                ( this.is_refund_pending || (!this.is_paid && !this.is_comped) )
        );
    }

    @action markRefunded() {
        this.is_refund_pending = true;
        this.prompt_student_to_pay = true;
    }

    @action markPaid() {
        this.is_paid = true;
        this.prompt_student_to_pay = false;
    }

    changePeriod(period) {
        this.period_id = period.id;
        return this.savePeriod();
    }

    @computed get is_dropped() {
        return !this.is_active;
    }

    // following methods are called by api
    drop() { }
    unDrop() {}
    savePeriod() {
        return { id: this.id, data: pick(this, 'period_id') };
    }
    saveStudentId() {
        return { id: this.id, data: pick(this, 'student_identifier') };
    }
    saveOwnStudentId() {
        return { id: this.id, data: pick(this, 'student_identifier') };
    }
}
