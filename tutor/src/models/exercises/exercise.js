import { last, map, filter, find, reduce } from 'lodash';
import { computed, action, observable } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';
import Tag from './tag';
import lazyGetter from 'shared/helpers/lazy-getter';
import ExerciseContent from 'shared/model/exercise';

import Book from '../reference-book';
import { extendHasMany } from '../../helpers/computed-property';

@identifiedBy('exercises/exercise')
export default class TutorExercise extends BaseModel {

  @identifier id;
  @field ecosystem_id;
  @field({ type: 'object' }) content;
  @belongsTo({ model: ExerciseContent, inverseOf: 'wrapper' }) content;
  @belongsTo({ model: 'book' }) book;
  @belongsTo({ model: 'course' }) course;
  @field is_excluded = false;
  @field has_interactive = false;
  @field has_video = false;
  @field page_uuid = false;
  @field({ type: 'array' }) pool_types;
  @field url = '';

  @hasMany({ model: Tag, inverseOf: 'exercise', extend: extendHasMany({
    importantInfo() {
      //console.log("IMP", filter(this, 'isImportant'))
      return reduce(filter(this, 'isImportant'),
        (o, t) => t.recordInfo(o),
        { lo: '', section: '', tagString: [] });
    },
  }) }) tags;

  @session isSelected = false;

  @observable _page;
  @computed get page() {
    if (this._page) { return this._page; }
    if (!this.book && !this.course) { return null; }
    const book = this.book || this.course.referenceBook;
    return book.pages.byUUID.get(this.page_uuid);
  }

  // below fields are set if read from stats
  set page(pg) {
    this._page = pg;
  }
  @hasMany({ model: 'task-plan/stats/question', inverseOf: 'exercise' }) question_stats;
  @session average_step_number;


  @computed get isReading() { return this.pool_types.includes('reading_dynamic'); }
  @computed get isHomework() { return this.pool_types.includes('homework_core'); }
  @computed get isAssignable() { return !this.is_excluded; }

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
