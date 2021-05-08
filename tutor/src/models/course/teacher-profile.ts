import {
    BaseModel, ID, field, modelize, NEW_ID, computed, action, getParentOf,
} from 'shared/model';
import urlFor from '../../api'
import { currentUser } from '../../models'
import type { Course } from '../../models'

export class TeacherProfile extends BaseModel {

    @field id: ID = NEW_ID;
    @field name = '';

    get course() { return getParentOf<Course>(this) }

    constructor() {
        super()
        modelize(this);
    }

    @computed get isCurrentUser () {
        return this.id == currentUser.profile_id;
    }

    @action async drop() {
        await this.api.request(urlFor('dropTeacher', { teacherId: this.id }));
        this.onDropped()
    }

    @action onDropped() {
        this.course.teacher_profiles.remove(this)
        if (this.isCurrentUser) {
            this.course.otherCourses.delete(this.course.id)
        }
    }

}
