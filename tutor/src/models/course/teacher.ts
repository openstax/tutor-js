import { BaseModel, computed, field, modelize, NEW_ID, getParentOf, action } from 'shared/model';
import urlFor from '../../api'
import type { CourseRoster } from './roster'

export class CourseTeacher extends BaseModel {

    @field id = NEW_ID;
    @field role_id = NEW_ID;
    @field first_name = '';
    @field last_name = '';
    @field is_active = false;

    get roster() { return getParentOf<CourseRoster>(this) }

    constructor() {
        super()
        modelize(this);
    }

    @action async drop() {
        await this.api.request(urlFor('dropTeacher', { teacherId: this.id }));
        this.onDropped()
    }

    @computed get isTeacherOfCourse() {
        return this.roster.course.primaryRole.id === this.role_id;
    }

    onDropped() {
        this.roster.teachers.remove(this);
        if (this.isTeacherOfCourse) {
            this.roster.course.otherCourses.delete(this.roster.course.id)
        }
    }
}
