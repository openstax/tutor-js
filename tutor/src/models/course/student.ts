import { computed, action } from 'mobx';
import { readonly } from 'core-decorators';
import { BaseModel, identifiedBy, field, identifier, belongsTo, modelize } from 'shared/model';
import Time from '../time';
import moment from 'moment';
import { pick } from 'lodash';
import Payments from '../payments';

@identifiedBy('course/student')
export default class CourseStudent extends BaseModel {
    @identifier id;

    @readonly static TEACHER_AS_STUDENT_ID = -9;

    @field name;
    @field uuid;
    @field first_name = '';
    @field last_name = '';
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
    @belongsTo({ model: 'course/roster' }) roster;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get courseId() {
        return this.course ? this.courseId : this.roster.course.id;
    }

    get mustPayImmediately() {
        return Boolean(this.needsPayment && moment(this.payment_due_at).isBefore(Time.now));
    }

    get trialTimeRemaining() {
        return moment.duration(moment().diff(moment(this.payment_due_at))).humanize();
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
          (
              this.is_refund_pending || (!this.is_paid && !this.is_comped)
          )
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
