import { BaseModel, field, computed, NEW_ID, getParentOf } from 'shared/model';
import type CourseRoster from './roster'
import User from '../user';

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
            User.removeCourse(this.roster.course);
        }
    }
}
