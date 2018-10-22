import { get, pick, omit, extend, isString, isEmpty, toArray } from 'lodash';
import { computed, action, intercept } from 'mobx';
import { SerializedHighlight } from '@openstax/highlighter';
import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';

<<<<<<< HEAD
=======
export
@identifiedBy('annotations/annotation/selector')
 class AnnotationSelector extends BaseModel {
>>>>>>> update all jsx? files

@identifiedBy('annotations/annotation')
export default class Annotation extends BaseModel {

  static MAX_TEXT_LENGTH = 500;
  @identifier id;
  @field chapter;
  @field content;
  @field courseId;
  @field section;
  @field title;
<<<<<<< HEAD
=======
  @belongsTo({ model: 'annotations/annotation/target' }) target;
  @field type = 'TextPositionSelector'
  @observable bounds;

  @action restore(highlighter) {
    this.measure();
    highlighter.doHighlight({ data_id: this.target.annotation.id });
  }

  @action measure() {
    const el = document.getElementById(this.referenceElementId);
    if (!el) { return false; }
    const selection = serializeSelection.restore(this, el);
    this.bounds = pick(selection.getRangeAt(0).getBoundingClientRect(), 'x', 'y', 'width', 'height', 'top', 'bottom', 'left');
    this.bounds.top += window.pageYOffset;
    this.bounds.left += window.pageXOffset;
    return true;
  }

}

export
@identifiedBy('annotations/annotation/target')
 class AnnotationTarget extends BaseModel {

  @identifier source;
  @belongsTo({ model: 'annotations/annotation' }) annotation;

  @hasMany({
    model: AnnotationSelector, inverseOf: 'target',
  }) selector;

}

export default
@identifiedBy('annotations/annotation')
 class Annotation extends BaseModel {

  @readonly static MAX_TEXT_LENGTH = 500;

  @identifier id;
  @field user;
>>>>>>> update all jsx? files
  @field text;
  @field type;
  @field({ type: 'object' }) rect;
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
