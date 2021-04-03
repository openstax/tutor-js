import { BaseModel, computed, field, NEW_ID, getParentOf } from 'shared/model';
import type CourseRoster from './roster'

export default class CourseTeacher extends BaseModel {

    @field id = NEW_ID;
    @field role_id = NEW_ID;
    @field first_name = '';
    @field last_name = '';
    @field is_active = false;

    get roster():CourseRoster { return getParentOf(this) }

    drop() {
        return { id: this.id };
    }

    @computed get isTeacherOfCourse() {
        return this.roster.course.primaryRole.id === this.role_id;
    }

    onDropped() {
        this.roster.teachers.remove(this);
        if (this.isTeacherOfCourse){
            this.roster.course.otherCourses.delete(this.roster.course.id)
        }
    }
}
