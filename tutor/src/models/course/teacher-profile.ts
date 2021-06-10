import {
    BaseModel, ID, field, modelize, NEW_ID, computed, getParentOf,
} from 'shared/model';
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

}
