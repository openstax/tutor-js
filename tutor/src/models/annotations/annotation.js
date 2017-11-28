import { get } from 'lodash';
import { computed, action } from 'mobx';
import Hypothesis from './hypothesis';
import {
  BaseModel, identifiedBy, field, identifier, session, hasMany,
} from '../base';

@identifiedBy('annotations/annotation/target')
export class AnnotationSelector extends BaseModel {

  @identifier elementId;

  @field chapter;
  @field content;
  @field courseId;
  @field end;
  @field section;
  @field start;
  @field title;
  @field type = 'TextPositionSelector'

}

@identifiedBy('annotations/annotation/target')
export class AnnotationTarget extends BaseModel {

  @identifier source;
  @hasMany({ model: AnnotationSelector }) selector;

}

@identifiedBy('annotations/annotation')
export default class Annotation extends BaseModel {

  @identifier id;
  @field user;
  @field text;
  @field uri;
  @field hidden;
  @field flagged;
  @field({ type: 'date' }) created;
  @field({ type: 'date' }) updated;
  @field({ type: 'object' }) rect;
  @field({ type: 'object' }) document;
  @field({ type: 'object' }) links;
  @field({ type: 'object' }) permissions;
  @field({ type: 'array' }) tags;
  @session({ type: 'object' }) style;
  @hasMany({ model: AnnotationTarget }) target;

  @computed get selection() {
    return get(this, 'target[0].selector[0]', {});
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

  @action save() {
    return Hypothesis.request({
      method: 'PATCH',
      service: `annotations/${this.id}`,
      data: { text: this.text },
    });
  }

  @action destroy() {
    return Hypothesis.request({
      method: 'DELETE',
      service: `annotations/${this.id}`,
    });
  }

}
