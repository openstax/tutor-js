import Question from './question'
import { isEmpty } from 'lodash';
import {
    BaseModel, modelize, field, computed, getParentOf,
} from '../../model';


export default
class ExerciseAnswer extends BaseModel {
    @field content_html = '';
    @field correctness = '0';
    @field feedback_html = '';

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
