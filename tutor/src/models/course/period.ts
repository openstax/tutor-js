import { find, pick, last } from 'lodash';
import { CourseTeacherStudent as TeacherStudent } from '../../models'
import type {
    CoursePeriodData, RoleData,
    Course,
    CourseRole as Role,
} from '../../models'

import Time from 'shared/model/time'
import urlFor from '../../api'

import {
    BaseModel,
    field,
    modelize,
    computed,
    action,
    runInAction,
    NEW_ID,
    getParentOf,
} from 'shared/model';

export class CoursePeriod extends BaseModel {
    @field id = NEW_ID;

    @field name = '';
    @field enrollment_code = '';
    @field enrollment_url = '';
    @field is_archived = false;

    @field num_enrolled_students = 0;

    get course() { return getParentOf<Course>(this); }

    constructor() {
        super();
        modelize(this);
    }

    @computed get scores() {
        return this.course.scores.periods.get(this.id);
    }

    @computed get hasEnrollments() {
        return this.num_enrolled_students > 0;
    }

    @computed get isActive() {
        return !this.is_archived;
    }

    @computed get enrollment_url_with_details() {
        const details = `${this.course.name}-${this.course.termFull}`.replace(/ /g, '-');
        return `${this.enrollment_url}/${details}`;
    }

    isNameValid( name: string ) {
        return Boolean(
            this.name == name || !find(this.course.periods, { name })
        );
    }

    // called from API
    async save() {
        const { isNew } = this
        const periodData = await this.api.request<CoursePeriodData>(
            isNew ?
                urlFor('createCoursePeriod', { courseId: this.course.id }) : urlFor('updateCoursePeriod', { periodId: this.id }),
            { data: pick(this, 'name') }
        )
        runInAction(() => {
            this.update(periodData)

            if (isNew) this.course.periods.push(this)
        })
    }

    async archive() {
        const periodData = await this.api.request<CoursePeriodData>(urlFor('archiveCoursePeriod', { periodId: this.id }))
        this.update(periodData)
    }

    async unarchive() {
        const periodData = await this.api.request<CoursePeriodData>(urlFor('restoreCoursePeriod', { periodId: this.id }))
        this.update(periodData)
    }

    @action async getTeacherStudentRole() {
        let role = this.course.roles.find((r) => (
            r.isTeacherStudent && r.period_id == this.id
        ));
        if (!role) {
            const returnedRole = await this.createTeacherStudent();
            this.course.roles.push(returnedRole as any as Role)
            role = last(this.course.roles)
        }
        runInAction(() => {
            if (!role) throw 'failed to find role for becoming teacher-student'
            role.joined_at = Time.now; // adjust the date so it always appears new
            let teacher_student = find(
                this.course.teacher_student_records, { role_id: role.id }
            );
            if (teacher_student) {
                teacher_student.update({ period_id: this.id })
            } else {
                this.course.teacher_student_records.push(
                    { role_id: role.id, period_id: this.id } as TeacherStudent
                );
                teacher_student = last(this.course.teacher_student_records) as TeacherStudent;
            }
        });
        return role;
    }

    createTeacherStudent() {
        return this.api.request<RoleData>(urlFor('createTeacherStudent', { periodId: this.id }))
    }
}
