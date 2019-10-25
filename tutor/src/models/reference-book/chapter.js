import { readonly } from 'core-decorators';
import { filter } from 'lodash';
import {
  BaseModel, identifiedBy, identifier, field, session, hasMany, computed,
} from 'shared/model';
import Page from './page';
import ChapterSection from '../chapter-section';
import { getters } from '../../helpers/computed-property';

export default
@identifiedBy('reference-book/chapter')
class ReferenceBookChapter extends BaseModel {
  @identifier id;
  @field title;
  @field type;
  @field({ model: ChapterSection }) chapter_section;

  @session book;
  @hasMany({ model: Page, inverseOf: 'chapter', extend: getters({
    assignable() { return filter(this, 'isAssignable'); },
    first() { return this.length ? this[0] : null; },
  }) }) children;
  @readonly depth = 1;
  @readonly isAssignable = true;
  @computed get bookIsCollated() {
    return this.book && this.book.is_collated;
  }

  // collated books do not have content for the chapter
  @computed get hasContent() {
    return !this.bookIsCollated;
  }

  get parent() {
    return this.book;
  }
}
