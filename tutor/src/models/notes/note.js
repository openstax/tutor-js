import { isString, get, pick, extend } from 'lodash';
import { computed, action, toJS, intercept } from 'mobx';
import ChapterSection from '../chapter-section';
import { SerializedHighlight } from '@openstax/highlighter';
import {
  BaseModel, identifiedBy, field, identifier, session,
} from 'shared/model';

@identifiedBy('notes/note')
export default class Note extends BaseModel {

  static MAX_TEXT_LENGTH = 500;
  @identifier id;
  @field annotation = '';
  @field anchor;
  @field course_id;
  @field({ type: 'object' }) contents = {};
  @field page_id;
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

  get course() {
    return this.page.notes.course;
  }

  get siblings() {
    return this.page.notes.forPageId(this.page_id);
  }

  get pageTopPosition() {
    return get(this, 'contents.rect.top', 0);
  }

  validateTextLength(change) {
    if (isString(change.newValue) && change.newValue.length > Note.MAX_TEXT_LEN) {
      change.newValue = change.newValue.slice(0, Note.MAX_TEXT_LEN);
    }
    return change;
  }

  @computed get content() {
    return this.contents.content;
  }

  @action save() {
    return extend(this.urlParams, {
      data: {
        course_id: this.course.id,
        ...pick(this, 'id', 'anchor', 'contents', 'annotation'),
      },
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
    this.page.onNoteDeleted(this);
  }

  @computed get urlParams() {
    return {
      pageUuid: this.page.uuid,
    };
  }

}
