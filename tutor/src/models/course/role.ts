import type { Course } from '../course'
import { TutorDate } from '../date'
import { first, sortBy }
import { readonly } from 'core-decorators';
import {
    BaseModel, field, model, hydrate, modelize, observable, computed, action
} from 'shared/model';
import { RoleObj } from '../types'
import moment, { unitOfTime } from 'moment';
import Time from '../time';

const ROLE_PRIORITY = ['guest', 'student', 'teacher', 'admin'];

export class CourseRoles {

    course: Course

    @readonly all = observable.array<CourseRole>()

    constructor(course: Course) {
        this.course = course
        modelize(this)
    }

    @computed get primary(): CourseRole {
        return first(sortBy(this.all, (r: CourseRole) => -1 * ROLE_PRIORITY.indexOf(r.type)));
    }

    @computed get current(): CourseRole {
        if (this.course.current_role_id) {
            return this.all.find(r => r.id == this.course.current_role_id) || this.primary;
        }
        return this.primary;
    }

    @computed get teacher() {
        return this.all.find(r => r.type == 'teacher')
    }

    @computed get student() {
        return this.all.find(r => r.type == 'student')
    }

    @computed get teacherStudent() {
        return this.all.find(r => r.type == 'teacher_student')
    }

    hydrate(roles: RoleObj[]) {
        this.all.replace(roles.map((r) => hydrate(CourseRole, { ...r, course: this.course })))
    }


    serialize() { return null; } // roles are not serialized

}

export default class CourseRole extends BaseModel {

    @model(TutorDate) joined_at = new TutorDate;
    @field type = '';
    @field period_id = 0;
    @field research_identifier = '';

    course!: Course

    constructor() {
        super()
        modelize(this)
    }

    @computed get isStudentLike() {
        return Boolean(this.isStudent || this.isTeacherStudent);
    }

    @computed get isStudent() {
        return this.type == 'student';
    }

    @computed get isTeacherStudent() {
        return this.type == 'teacher_student';
    }

    @computed get isTeacher() {
        return this.type == 'teacher';
    }

    joinedAgo(terms: unitOfTime.Diff = 'days') {
        return moment(Time.now).diff(this.joined_at, terms);
    }

    @action async become({ reset = true } = {}) {
        if (reset) {
            this.course.clearCachedStudentData();
        }
        this.course.current_role_id = this.id;
    }
}
