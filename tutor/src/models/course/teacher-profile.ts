import { BaseModel, ID, field, modelize, NEW_ID, computed } from 'shared/model';
import { currentUser } from '../../models';


export class TeacherProfile extends BaseModel {

    @field id: ID = NEW_ID;
    @field name = '';

    constructor() {
        super()
        modelize(this);
    }

    @computed get isCurrentUser () {
        return this.id == currentUser.profile_id;
    }


}
