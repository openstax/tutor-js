import {
    BaseModel, ID, NEW_ID, field, model, modelize,
    computed, action, readonly, getParentOf,
} from 'shared/model';
import type { StudentData, CoursePeriod, Course } from '../../models'
import { FeatureFlags, PaymentCode } from '../../models'
import Time from 'shared/model/time'
import urlFor from '../../api'
import { pick } from 'lodash';


export class CourseStudent extends BaseModel {

    @readonly static TEACHER_AS_STUDENT_ID = -9;
    @field id: ID = NEW_ID
    @field name = '';
    @field uuid = '';
    @field first_name = '';
    @field last_name = '';
    @field is_active = false;
    @field is_comped = false;
    @field is_paid = false;
    @field is_refund_allowed = false;
    @field is_refund_pending = false;
    @field prompt_student_to_pay = false;
    @field period_id: ID = NEW_ID;
    @field role_id: ID = NEW_ID;
    @field student_identifier = '';
    @field payment_code?: PaymentCode
    @model(Time) payment_due_at = Time.unknown

    get course() { return getParentOf<Course>(this) }

    constructor() {
        super()
        modelize(this)
    }

    get mustPayImmediately() {
        return Boolean(this.needsPayment && this.payment_due_at.isInPast)
    }

    get trialTimeRemaining() {
        return this.payment_due_at.intervalToNow.humanized
    }

    onSaved({ data }: { data: StudentData }) {
        this.update(data);
    }

    // corresponds to how the BE sets the "prompt_student_to_pay" flag
    // We calculate it ourself so that it can change when payments is enabled/disabled
    // https://github.com/openstax/tutor-server/blob/master/app/representers/api/v1/student_representer.rb#L68-L84
    @computed get needsPayment() {
        return Boolean(
            FeatureFlags.is_payments_enabled && this.isUnPaid
        );
    }

    @computed get paymentCodeAsPurchase() {
        if (!this.payment_code) { return null }

        return {
            product: { name: this.course.name },
            purchased_at: this.payment_code.redeemed_at,
            identifier: this.payment_code.code,
            is_payment_code: true,
        }
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

    @action async changePeriod(period: CoursePeriod) {
        this.period_id = period.id;
        return this.savePeriod();
    }

    @computed get is_dropped() {
        return !this.is_active;
    }

    async drop() {
        this.is_active = false
        return this.api.request(urlFor('dropStudent', { studentId: this.id }))
    }

    async unDrop() {
        this.is_active = true
        return this.api.request(urlFor('unDropStudent', { studentId: this.id }))
    }

    async savePeriod() {
        return this.api.request(
            urlFor('updateStudent', { studentId: this.id }),
            { data: pick(this, 'period_id') },
        )
    }

    async saveStudentId() {
        return this.api.request(
            urlFor('updateStudent', { studentId: this.id }),
            { data: pick(this, 'student_identifier') },
        )
    }

    async saveOwnStudentId() {
        return this.api.request(
            urlFor('saveOwnStudentId', { courseId: this.course.id }),
            { data: pick(this, 'student_identifier') },
        )
    }

}
