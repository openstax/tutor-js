import { readonly } from 'core-decorators';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';
import Page from './page';
import ChapterSection from '../chapter-section';

@identifiedBy('reference-book/chapter')
export default class ReferenceBookChapter extends BaseModel {
  @identifier id;
  @field title;
  @field type;
  @field({ model: ChapterSection }) chapter_section;
  @session book;
  @hasMany({ model: Page, inverseOf: 'chapter' }) children;
  @readonly depth = 1;
}
