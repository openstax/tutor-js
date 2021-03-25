import { isString, get, pick, extend } from 'lodash';
import ChapterSection from '../chapter-section';
import { SerializedHighlight } from '@openstax/highlighter';
import {
  BaseModel,
  field,
  computed,
  action,
  toJS,
  intercept,
  observable,
  model,
  modelize,
  NEW_ID,
} from 'shared/model';
import DateTime from 'shared/model/date-time';

export default class Note extends BaseModel {

  static MAX_TEXT_LENGTH = 500;
  @field id = NEW_ID;
  @field annotation = '';
  @field anchor;
  @field course_id;
  @field contents: any = {};
  @field page_id;
  @model(ChapterSection) chapter_section;
  @model(DateTime) created_at = DateTime.unknown;
  @model(DateTime) updated_at = DateTime.unknown;

  constructor(attrs = {}, page) {
      super(attrs);
      modelize(this);
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
