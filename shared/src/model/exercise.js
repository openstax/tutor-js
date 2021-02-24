import {
    BaseModel, identifiedBy, identifier, session, field, hasMany, computed, action,
} from '../model';
import { reduce, map, filter, inRange, merge, every, some, isNil } from 'lodash';
import TagAssociation from './exercise/tag-association';
import invariant from 'invariant';
import Attachment from './exercise/attachment';
import Author from './exercise/author';
import Question from './exercise/question';
import Tag from './exercise/tag';

export { Attachment, Author, Question, Tag };

@identifiedBy('exercise')
export default
class Exercise extends BaseModel {

    static build(attrs) {
        return new this(merge(attrs, {
            questions: [{
                formats: [],
            }],
        }));
    }

  @identifier uuid;
  @field id;
  @field uid;
  @field nickname;
  @field({ type: 'array' }) versions;

  @field is_vocab;

  @field stimulus_html;

  @session published_at;
  @session wrapper;

  @hasMany({ model: Attachment, inverseOf: 'exercise' }) attachments;
  @hasMany({ model: Author, extend: {
      names() {
          return map(this, 'name');
      },
  } }) authors;
  @hasMany({ model: Author })  copyright_holders;
  @hasMany({ model: Question, inverseOf: 'exercise' }) questions;
  @hasMany({
      model: Tag,
      extend: TagAssociation,
  }) tags;

  @computed get pool_types() {
      return [];
  }

  @computed get number() {
      const n = this.uid.split('@')[0];
      return isNil(n) ? n : Number(n) ;
  }

  @computed get version() {
      const n = this.uid.split('@')[1];
      return isNil(n) ? n : Number(n) ;
  }

  @computed get cnxModuleUUIDs() {
      return map(filter(this.tags, { type: 'context-cnxmod' }), 'value');
  }

  @computed get validity() {
      return reduce(this.questions.concat(this.tags), (memo, model) => ({
          valid: memo.valid && model.validity.valid,
          part: memo.part || model.validity.part,
      }) , { valid: true });
  }

  @action toggleMultiPart() {
      if (this.isMultiPart) {
          this.questions.replace([this.questions[0]]);
          this.stimulus_html = '';
      } else {
          this.questions.push({});
      }
  }

  @action moveQuestion(question, offset) {
      const index = this.questions.indexOf(question);
      invariant((index !== -1) && inRange(index+offset, 0, this.questions.length),
          'question not found or cannot move past bounds');
      this.questions.splice(index+offset, 0, this.questions.splice(index, 1)[0]);
  }

  @computed get hasStimulus() {
      return Boolean(this.stimulus_html);
  }

  @computed get isMultiPart() { return this.questions.length > 1; }
  @computed get isSinglePart() { return this.questions.length == 1; }
  @computed get isMultiChoice() { return every(this.questions, 'isMultipleChoice'); }
  @computed get isOpenEnded() { return some(this.questions, 'isOpenEnded'); }
  //WRM is OpenEnded and have no answers
  @computed get isWrittenResponse() { return every(this.questions, (q) => q.isOpenEnded && q.answers.length === 0);}

  @computed get isPublishable() {
      return Boolean(!this.isNew && this.validity.valid && !this.published_at);
  }

  @action onQuestionFreeResponseSelected() {
      this.tags.findOrAddWithType('type').value = 'practice';
  }

}
