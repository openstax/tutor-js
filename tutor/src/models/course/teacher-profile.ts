import { BaseModel, ID, field, modelize, NEW_ID } from 'shared/model';
// import User from '../user';


export class TeacherProfile extends BaseModel {

    @field id: ID = NEW_ID;
    @field name = '';

    constructor() {
        super()
        modelize(this);
    }

    // @computed get isCurrentUser () {
    //     return this.id == User.profile_id;
    // }


}
