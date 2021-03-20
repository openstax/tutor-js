import {
    BaseModel, field, modelize,
} from '../../model';

export class ExerciseAuthor extends BaseModel {

    @field user_id = '';
    @field name = '';

    constructor() {
        super()
        modelize(this)
    }

}
