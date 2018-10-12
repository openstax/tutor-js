import { get, pick, omit, extend, isString, isEmpty, toArray } from 'lodash';
import { computed, action, observable, intercept } from 'mobx';
import serializeSelection from 'serialize-selection';
import {Highlight, SerializedHighlight} from 'highlighter';
import {
  BaseModel, identifiedBy, field, identifier
} from 'shared/model';


@identifiedBy('annotations/annotation')
export default class Annotation extends BaseModel {

  static MAX_TEXT_LENGTH = 500;
  @identifier id;
  @field chapter;
  @field content;
  @field courseId;
  @field section;
  @field title;
  @field text;
  @field type;
  highlight;
  listing;

  constructor(attrs) {
    super(attrs);
    this.highlight = new SerializedHighlight(attrs);
    this.listing = attrs.listing;
    intercept(this, 'text', this.validateTextLength);
  }

  validateTextLength(change) {
    if (isString(change.newValue) && change.newValue.length > Annotation.MAX_TEXT_LEN) {
      change.newValue = change.newValue.slice(0, Annotation.MAX_TEXT_LEN);
    }
    return change;
  }

  @computed get chapter_section() {
    return [ this.chapter, this.section ];
  }

  @computed get formattedChapterSection() {
    let cs = `${this.chapter}`;
    if (this.section) { cs += `.${this.section}`; }
    return cs;
  }

  @action save() {
    return this.listing.update(this);
  }

  @action destroy() {
    return this.listing.destroy(this);
  }
}
