import { BaseModel, field,  modelize, ID, NEW_ID } from 'shared/model';

class User extends BaseModel {

    @field id: ID = NEW_ID;
    @field username = '';
    @field faculty_status = '';
    @field first_name = '';
    @field full_name = '';
    @field last_name = '';
    @field self_reported_role = '';
    @field support_identifier = '';

    constructor() {
        super()
        modelize(this)
    }

    bootstrap(data: any) {
        Object.assign(this, data);
    }

}

const currentUser = new User;

export { User };
export default currentUser;
