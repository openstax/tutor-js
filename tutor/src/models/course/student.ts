import type CoursePeriod from './period'
import type Course from '../course'
import DateTime from 'shared/model/date-time'
import urlFor from '../../api'
import {
    BaseModel, ID, NEW_ID, field, model, hydrateModel, modelize,
    observable, computed, action, readonly, getParentOf,
} from 'shared/model';
import { StudentObj } from '../types'
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
        this.all.replace(students.map((r) => hydrateModel(CourseStudent, { ...r, course: this.course })))
    }

    serialize() { return null; } // students are not serialized

}

export default class CourseStudent extends BaseModel {

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
    @model(DateTime) payment_due_at = DateTime.unknown

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
        return this.api.request(urlFor('dropStudent', { studentId: this.id }))
    }

    async unDrop() {
        return this.api.request(urlFor('unDropStudent', { studentId: this.id }))
    }

    async savePeriod() {
        return this.api.request(
            urlFor('updateStudent', { studentId: this.id }),
            pick(this, 'period_id'),
        )
    }

    async saveStudentId() {
        return this.api.request(
            urlFor('updateStudent', { studentId: this.id }),
            pick(this, 'student_identifier'),
        )
    }

    async saveOwnStudentId() {
        return this.api.request(
            urlFor('saveOwnStudentId', { courseId: this.course.id }),
            pick(this, 'student_identifier'),
        )
    }

}
