import { get, pick, omit, extend, isString } from 'lodash';
import { computed, action, observable, intercept } from 'mobx';
import serializeSelection from 'serialize-selection';
import { readonly } from 'core-decorators';
import {
  BaseModel, identifiedBy, field, identifier, session, belongsTo, hasMany,
} from '../base';
import DOM from '../../helpers/dom';

@identifiedBy('annotations/annotation/target')
export class AnnotationSelector extends BaseModel {

  @identifier elementId;

  @field chapter;
  @field content;
  @field courseId;
  @field end;
  @field({ type: 'object' }) rect;
  @field researchId;
  @field section;
  @field start;
  @field title;
  @field type = 'TextPositionSelector'
  @observable bounds;

  @action restore(highlighter) {
    const el = document.getElementById(this.elementId);
    if (!el) { return null; }
    const selection = serializeSelection.restore(this, el);
    this.bounds = pick(selection.getRangeAt(0).getBoundingClientRect(), 'x', 'y', 'width', 'height', 'top', 'bottom', 'left');
    this.bounds.top += window.pageYOffset;
    this.bounds.left += window.pageXOffset;
    if (highlighter) {
      highlighter.doHighlight();
    }
    return selection;
  }

}

@identifiedBy('annotations/annotation/target')
export class AnnotationTarget extends BaseModel {

  @identifier source;
  @hasMany({ model: AnnotationSelector }) selector;

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
  @hasMany({ model: AnnotationTarget }) target;
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

  @computed get elementId() {
    return get(this.selection, 'elementId');
  }

  @computed get element() {
    return this.elementId ? document.getElementById(this.elementId) : null;
  }

  @computed get referenceElement() {
    return this.element ? DOM.closest(this.element, '[id]') : null;
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
