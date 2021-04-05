import {
    BaseModel, field, model, getParentOf, modelize, array,
} from '../../model';
import ExerciseAttachment from './attachment'
import type ExerciseQuestion from './question'

export default
class ExerciseSolution extends BaseModel {

    @field content_html = '';
    @field solution_type = 'detailed';

    @model(ExerciseAttachment) attachments = array<ExerciseAttachment>()

    get question() { return getParentOf<ExerciseQuestion>(this) }

    constructor() {
        super()
        modelize(this)
    }
}
