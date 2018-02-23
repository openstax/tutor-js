import { get, pick, omit, extend, isString, isEmpty, toArray } from 'lodash';
import { computed, action, observable, intercept } from 'mobx';
import serializeSelection from 'serialize-selection';
import { readonly } from 'core-decorators';
import {
  BaseModel, identifiedBy, field, identifier, session, belongsTo, hasMany,
} from 'shared/model';

@identifiedBy('annotations/annotation/selector')
export class AnnotationSelector extends BaseModel {

  @identifier referenceElementId;

  @field chapter;
  @field content;
  @field courseId;
  @field end;
  @field({ type: 'object' }) rect;
  @field researchId;
  @field section;
  @field start;
  @field title;
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

@identifiedBy('annotations/annotation/target')
export class AnnotationTarget extends BaseModel {

  @identifier source;
  @belongsTo({ model: 'annotations/annotation' }) annotation;

  @hasMany({
    model: AnnotationSelector, inverseOf: 'target',
  }) selector;

}

@identifiedBy('annotations/annotation')
export default class Annotation extends BaseModel {

  @readonly static MAX_TEXT_LENGTH = 500;

  @identifier id;
  @field user;
  @field text;
  @field uri;
  @field hidden;
  @field flagged;
  @field({ type: 'date' }) created;
  @field({ type: 'date' }) updated;
  @field({ type: 'object' }) document;
  @field({ type: 'object' }) links;
  @field({ type: 'object' }) permissions;
  @field({ type: 'array' }) tags;
  @session({ type: 'object' }) style;
  @hasMany({ model: AnnotationTarget, inverseOf: 'annotation' }) target;
  @belongsTo({ model: 'annotations' }) listing;

  constructor(attrs) {
    super(attrs);
    intercept(this, 'text', this.validateTextLength);
  }

  validateTextLength(change) {
    if (isString(change.newValue) && change.newValue.length > Annotation.MAX_TEXT_LEN) {
      change.newValue = change.newValue.slice(0, Annotation.MAX_TEXT_LEN);
    }
    return change;
  }

  @computed get selection() {
    return get(this, 'target[0].selector[0]', {});
  }

  @computed get referenceElementId() {
    return get(this.selection, 'referenceElementId');
  }

  get referenceElement() {
    return this.referenceElementId ? document.getElementById(this.referenceElementId) : null;
  }

  get elements() {
    return toArray(document.querySelectorAll(`[data-id="${this.id}"]`));
  }

  @computed get isAttached() {
    return !isEmpty(this.elements);
  }

  @computed get courseId() {
    return this.selection.courseId;
  }

  @computed get chapter() {
    return this.selection.chapter;
  }

  @computed get section() {
    return this.selection.section;
  }

  @computed get chapter_section() {
    return [ this.chapter, this.section ];
  }

  @computed get formattedChapterSection() {
    let cs = `${this.chapter}`;
    if (this.section) { cs += `.${this.section}`; }
    return cs;
  }

  @computed get title() {
    return this.selection.title;
  }

  @action save() {
    return this.listing.update(this);
  }

  @action destroy() {
    return this.listing.destroy(this);
  }

  @action updateAfterSave(data) {
    // update target so it doesn't overwrite and lose the serialized bounds
    this.update(omit(data, 'target'));
    this.selection.update(get(data, 'target[0].selector[0]'));
  }

  @computed get asPage() {
    return extend(
      { csId: `${this.chapter}.${this.section}`, annotation: this },
      pick(this.selection, ['courseId', 'title', 'chapter', 'section']),
    );
  }

  isSiblingOfElement(el) {
    if (!el) { return false; }
    if (el === this.referenceElement) { return true; }
    let node = el.parentNode;
    while (node != null) {
      if (node == this.referenceElement) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

}
