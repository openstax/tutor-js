import {
  BaseModel, identifiedBy, identifier, hasMany, field, belongsTo,
} from './base';

import { observable, computed } from 'mobx';
import TaskStep from './task/step';

const TASKS = observable.shallowMap();

@identifiedBy('task')
export default class Task extends BaseModel {

  static forId(id) { return TASKS.get(id) || new Task({ id }); }

  @identifier id;

  @field type;

  @field is_deleted;
  @field is_feedback_available;
  @field is_shared;

  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) opens_at;
  @field({ type: 'date' }) last_worked_at;

  @field({ type: 'object' }) spy;

  @hasMany({ model: TaskStep, inverseOf: 'tour' }) steps;

  constructor(attrs) {
    super(attrs);
    if (this.id) { TASKS.set(this.id, this); } // add to identity map
  }

  // will be overwridden by api
  fetch() {}

  @computed get allSteps(){
    return this.steps; // will also insert placeholders eventually
  }
}
