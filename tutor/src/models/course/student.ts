import type { Course } from '../course'
import { DateTime } from '../date-time'
import Api from '../../api'
import {
    BaseModel, ID, NEW_ID, field, model, hydrate, modelize, observable, computed, action, readonly,
} from 'shared/model';
import type { CoursePeriod } from './period'
import Time from '../time';
import { StudentObj } from '../types'
import moment from 'moment';
import { pick } from 'lodash';
import Payments from '../payments';

export class Students {

    course: Course

    @readonly all = observable.array<CourseStudent>()

    constructor(course: Course) {
        this.course = course
        modelize(this)
    }

    hydrate(students: StudentObj[]) {
        this.all.replace(students.map((r) => hydrate(CourseStudent, { ...r, course: this.course })))
    }

    serialize() { return null; } // students are not serialized

}

export default class CourseStudent extends BaseModel {

    @readonly static TEACHER_AS_STUDENT_ID = -9;

    @field name = '';
    @field uuid = '';
    @field first_name = '';
    @field last_name = '';
    @field is_active = false;
    @field is_comped = false;
    @field is_paid = false;
    @field is_refund_allowed = false;
    @field is_refund_pending = false;
    @model(DateTime) payment_due_at = DateTime.invalid('uninitialized')
    @field prompt_student_to_pay = false;

    @field period_id: ID = NEW_ID;
    @field role_id: ID = NEW_ID;
    @field student_identifier = '';

    course!: Course

    constructor() {
        super()
        modelize(this)
    }

    get mustPayImmediately() {
        return Boolean(this.needsPayment && moment(this.payment_due_at).isBefore(Time.now));
    }

    get trialTimeRemaining() {
        return moment.duration(moment().diff(moment(this.payment_due_at))).humanize();
    }

    onSaved({ data }: { data: StudentObj }) {
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

    @action async changePeriod(period: CoursePeriod) {
        this.period_id = period.id;
        return this.savePeriod();
    }

    @computed get is_dropped() {
        return !this.is_active;
    }

    async drop() {
        return this.api.request(Api.dropStudent, { params: { id: this.id } })
    }

    async unDrop() {
        return this.api.request(Api.unDropStudent, { params: { id: this.id } })
    }

    async savePeriod() {
        return this.api.request(Api.updateStudent, {
            params: { id: this.id },
            data: pick(this, 'period_id'),
        })
    }

    async saveStudentId() {
        return this.api.request(Api.saveStudentId, {
            params: { id: this.id },
            data: pick(this, 'student_identifier'),
        })
    }

    async saveOwnStudentId() {
        return this.api.request(Api.saveOwnStudentId, {
            params: { id: this.id },
            data: pick(this, 'student_identifier'),
        })
    }

}
