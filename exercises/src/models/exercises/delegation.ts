import { BaseModel, modelize, field } from 'shared/model';


export default
class ExerciseDelegation extends BaseModel {
    @field delegator_id = '';

    @field delegate_id = '';
    @field delegate_type = '';

    @field can_assign_authorship = true
    @field can_assign_copyright = true
    @field can_read = true
    @field can_update = true

    constructor() {
        super()
        modelize(this)
    }
}
