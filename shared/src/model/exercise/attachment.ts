import type Exercise from '../exercise'
import {
    BaseModel, field, modelize, getParentOf,
} from '../../model';

export default
class ExerciseAttachment extends BaseModel {

    get exercise() { return getParentOf<Exercise>(this) }

    @field asset: any;

    constructor() {
        super()
        modelize(this)
    }
}
