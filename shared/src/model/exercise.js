import {
  BaseModel, identifiedBy, identifier, session, field, hasMany, computed,
} from '../model';
import { map, filter } from 'lodash';

import Attachment from './exercise/attachment';
import Author from './exercise/author';
import Question from './exercise/question';
import Tag from './exercise/tag';

export { Attachment, Author, Question, Tag };

@identifiedBy('exercise')
export default class Exercise extends BaseModel {

  @identifier uuid;
  @field uid;
  @field version;
  @field({ type: 'array' }) versions;
  @field({ type: 'array' }) formats;
  @field is_vocab;
  @field number;
  @field id;

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

}
