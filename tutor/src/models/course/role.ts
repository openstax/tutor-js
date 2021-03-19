import type { Course } from '../course'
import { first, sortBy } from 'lodash'
import { readonly } from 'core-decorators';
import {
    BaseModel, field, model, hydrate, modelize, observable, computed, action
} from 'shared/model';
import { RoleObj } from '../types'
import { DateTime, DurationUnit } from '../date-time';

const ROLE_PRIORITY = ['guest', 'student', 'teacher', 'admin'];

export class CourseRoles {

    course: Course

    @readonly all = observable.array<CourseRole>()

    constructor(course: Course) {
        this.course = course
        modelize(this)
    }

    @computed get primary(): CourseRole {
        return first(sortBy(this.all, (r: CourseRole) => -1 * ROLE_PRIORITY.indexOf(r.type)))!;
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

    @model(DateTime) joined_at = DateTime.invalid('uninitialized')
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

    joinedAgo(terms: DurationUnit = 'days') {
        return this.joined_at.diff(DateTime.now(), terms);
    }

    @action async become({ reset = true } = {}) {
        if (reset) {
            this.course.clearCachedStudentData();
        }
        this.course.current_role_id = this.id;
    }
}
