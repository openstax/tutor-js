import { isString, last, pick, extend } from 'lodash';
import { computed, action, get, toJS, intercept } from 'mobx';
import ChapterSection from '../chapter-section';
import { SerializedHighlight } from '@openstax/highlighter';
import {
  BaseModel, identifiedBy, field, identifier, session,
} from 'shared/model';


export default
@identifiedBy('notes/note')
class Note extends BaseModel {

  static MAX_TEXT_LENGTH = 500;
  @identifier id;
  // @field chapter;
  // @field section;
  // @field courseId;
  // @field title;
  // @field({ type: 'object' }) rect;

  @field annotation = '';

  @field anchor;

  @field({ type: 'object' }) contents = {};
  @session({ model: ChapterSection }) chapter_section;
  @session({ type: 'date' }) created_at;
  @session({ type: 'date' }) updated_at;

  constructor(attrs = {}, page) {
    super(attrs);
    this.page = page;
    intercept(this, 'annotation', this.validateTextLength);
  }


  @computed get highlight() {
    return new SerializedHighlight(
      extend(toJS(this.contents), pick(this, 'id')),
    );
  }

  validateTextLength(change) {
    if (isString(change.newValue) && change.newValue.length > Note.MAX_TEXT_LEN) {
      change.newValue = change.newValue.slice(0, Note.MAX_TEXT_LEN);
    }
    return change;
  }

  @action save() {
    return extend(this.urlParams, {
      data: pick(this, 'id', 'anchor', 'contents', 'annotation'),
    });
  }

  @action destroy() {
    return this.urlParams;
  }

  onUpdated({ data }) {
    this.update(data);
    this.page.set(this.id, this);
  }

  onDeleted() {
    this.page.delete(this.id);
  }

  @computed get urlParams() {
    return {
      id: this.id,
      chapterSection: this.chapter_section.format({ skipZeros: false }),
      courseId: this.page.notes.course.id,
    };
  }

};
