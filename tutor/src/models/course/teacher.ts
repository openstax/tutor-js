import { BaseModel, computed, field, modelize, NEW_ID, getParentOf, action } from 'shared/model';
import urlFor from '../../api'
import { Course, CourseRoster } from '../../models'

export class CourseTeacher extends BaseModel {

    @field id = NEW_ID;
    @field role_id = NEW_ID;
    @field first_name = '';
    @field last_name = '';
    @field is_active = false;

    constructor() {
        super()
        modelize(this);
    }


    get parent() {
        return getParentOf<Course|CourseRoster>(this)
    }

    get course():Course {
        if (this.parent instanceof Course) {
            return this.parent
        } else {
            return this.roster.course
        }
    }

    get roster():CourseRoster {
        if (this.parent instanceof CourseRoster) {
            return this.parent
        } else {
            return this.course.roster
        }
    }

    @action async drop() {
        await this.api.request(urlFor('dropTeacher', { teacherId: this.id }));
        this.onDropped()
    }

    @computed get isTeacherOfCourse() {
        return this.course.primaryRole.id === this.role_id;
    }

    onDropped() {
        this.roster.teachers.remove(this);
        if (this.isTeacherOfCourse) {
            this.roster.course.otherCourses.delete(this.roster.course.id)
        }
    }
}
