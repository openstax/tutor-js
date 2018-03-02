import { last, map, filter } from 'lodash';
import { computed, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, hasMany,
} from 'shared/model';
import Tag from './tag';
import lazyGetter from 'shared/helpers/lazy-getter';
import ExerciseContent from 'shared/model/exercise';
import Book from '../reference-book';

@identifiedBy('exercises/exercise')
export default class Exercise extends BaseModel {

  @identifier id;
  @field ecosystem_id;
  @field({ type: 'object' }) content;
  @belongsTo({ model: ExerciseContent, inverseOf: 'wrapper' }) content;

  @belongsTo({ model: Book }) book;
  @belongsTo({ model: Book }) course;

  @field is_excluded = false;
  @field has_interactive = false;
  @field has_video = false;
  @field page_uuid = false;
  @field({ type: 'array' }) pool_types;
  @field url = '';
  @hasMany({ model: Tag }) tags;

  @computed get page() {
    if (!this.book && !this.course) { return null; }
    const book = this.book || this.course.referenceBook;
    return book.pages.byUUID.get(this.page_uuid);
  }

  @computed get isReading() { return this.pool_types.includes('reading_dynamic'); }
  @computed get isHomework() { return this.pool_types.includes('homework_core'); }

  @computed get types() {
    return map(
      filter(this.tags, tag =>
        tag.id.startsWith('filter-type:') || tag.id.startsWith('type:')
      ),
      tag => last(tag.id.split(':'))
    );
  }

  // called from api
  @action saveExclusion(course, is_excluded) {
    this.is_excluded = is_excluded;
    return { id: course.id, data: {} };
  }


}
