import {
  BaseModel, identifiedBy, identifier, session, field, hasMany, computed,
} from '../model';
import { reduce, map, filter, merge } from 'lodash';

import Attachment from './exercise/attachment';
import Author from './exercise/author';
import Question from './exercise/question';
import Tag from './exercise/tag';

export { Attachment, Author, Question, Tag };

@identifiedBy('exercise')
export default class Exercise extends BaseModel {

  static build(attrs) {
    return new this(merge(attrs, { questions: [{ }] }));
  }

  @identifier uuid;
  @field id;
  @field uid;
  @field version;
  @field({ type: 'array' }) versions;
  @field({ type: 'array' }) formats;
  @field is_vocab;
  @field number;

  @session wrapper;

  @hasMany({ model: Attachment }) attachments;
  @hasMany({ model: Author }) authors;
  @hasMany({ model: Author })  copyright_holders;
  @hasMany({ model: Question }) questions;
  @hasMany({ model: Tag }) tags;

  @computed get hasFreeResponse() {
    return this.formats.includes('free-response');
  }

  @computed get pool_types() {
    return [];
  }

  @computed get cnxModuleUUIDs() {
    return map(filter(this.tags, { type: 'context-cnxmod' }), 'value');
  }

  @computed get validity() {
    return reduce(this.questios, (memo, question) => ({
      valid: memo.valid && question.validity.valid,
      part: memo.part || question.validity.part,
    }) , { valid: true });
  }

  tagsWithPrefix(prefix) {
    return filter(this.tags, t => t.type === prefix)
  }

  @computed get isMultiPart() {
    return this.questions.length > 1;
  }

}
