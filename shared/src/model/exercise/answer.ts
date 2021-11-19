import Question from './question'
import { isEmpty } from 'lodash';
import {
    BaseModel, modelize, field, computed, getParentOf, ID, NEW_ID,
} from '../../model';


export default
class ExerciseAnswer extends BaseModel {
    @field id: ID = NEW_ID
    @field content_html?: string
    @field correctness?: string
    @field feedback_html?: string

    get question() { return getParentOf<Question>(this) }

    @computed get validity() {
        if (isEmpty(this.content_html)) {
            return { valid: false, part: 'Answer Distractor' };
        } else {
            return { valid: true };
        }
    }

    @computed get isCorrect() {
        return Number(this.correctness) > 0;
    }

    constructor() {
        super()
        modelize(this)
    }

}
