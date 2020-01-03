import { isEmpty } from 'lodash';
import {
  BaseModel, identifiedBy, identifier, field, computed, belongsTo,
} from '../../model';

export default
@identifiedBy('exercise/answer')
class ExerciseAnswer extends BaseModel {
  @identifier id;
  @field content_html;
  @field correctness;
  @field feedback_html;

  // set via inverseOf
  @belongsTo({ model: 'exercise/question' }) question;

  @computed get validity() {
    if (isEmpty(this.content_html)) {
      return { valid: false, part: 'Answer Distractor' };
    } else {
      return { valid: true };
    }
  }

  @computed get isCorrect() {
    return this.correctness === '1.0';
  }
}
